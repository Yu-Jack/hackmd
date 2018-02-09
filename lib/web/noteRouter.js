'use strict'
const cheerio = require('cheerio')
const axios = require('axios')
const async = require('async')
const {promisify} = require('util')
const LZString = require('lz-string')
const Router = require('express').Router

const response = require('../response')
const models = require('../models')

const {markdownParser, jsonParser, wrap} = require('./utils')
const logger = require('../logger')

const noteRouter = module.exports = Router()
const eachLimit = promisify(async.eachLimit)

// get new note
noteRouter.get('/new', response.newNote)
// post new note with content
noteRouter.post('/new', markdownParser, response.newNote)
noteRouter.post('/new-in-board', jsonParser, wrap(async (req, res) => {
  if (!req.body.board_id || !req.body.name) return res.sendStatus(422)

  // create note
  const note = await models.Note.create({
    ownerId: req.user.id,
    content: `# ${req.body.name}`
  })

  // link note
  const response = await axios.post('http://localhost:8181/remark/link-note', {
    board_id: req.body.board_id,
    name: req.body.name,
    parent_id: req.body.parent_id || '',
    short_id: note.shortid
  })

  logger.info({
    board_id: req.body.board_id,
    name: req.body.name,
    parent_id: req.body.parent_id || '',
    short_id: note.shortid
  })

  if (response.data.status !== 0) {
    logger.error(`Failed to link note use with /remark/link-note`)
    return res.sendStatus(500)
  }

  res.sendStatus(200)
}))
noteRouter.post('/import', jsonParser, wrap(async (req, res, next) => {
  if (!req.body.sid) return res.sendStatus(422)

  const hackmd = axios.create({
    baseURL: 'https://hackmd.io',
    headers: {
      Cookie: `connect.sid=${req.body.sid};`
    }
  })
  const owner = req.user.id
  // fetch history from hackmd
  const history = (await hackmd.get('/history')).data.history
  const errors = []
  
  // fetch notes from hackmd
  await eachLimit(history, 3, async (hackmd_note) => {
    try {
      const html = (await hackmd.get(`/s/${hackmd_note.id}`)).data
      const markdown = cheerio.load(html)('#doc').text()
      const note = await models.Note.create({
          ownerId: owner,
          content: markdown
      })
      hackmd_note.id = LZString.compressToBase64(note.id)
    } catch (error) {
      logger.info(`import note error for ${hackmd_note.id} = ${error.message}`)
      hackmd_note.error_message = error.message
      errors.push(JSON.parse(JSON.stringify(hackmd_note)))
      hackmd_note.id = null
    }
  })

  // remove error notes
  const success_import_count = history.length
  let success_history = history.filter((note) => note.id)

  const user = await models.User.findOne({
    where: {
      id: owner
    }
  })
  if (user.history) {
    success_history = success_history.concat(JSON.parse(user.history))
  }

  // save history
  await models.User.update({
    history: JSON.stringify(success_history)
  }, {
    where: {
      id: owner
    }
  })

  res.json({
    import_count: success_import_count,
    errors: errors
  })
}))
// get publish note
noteRouter.get('/s/:shortid', response.showPublishNote)
// publish note actions
noteRouter.get('/s/:shortid/:action', response.publishNoteActions)
// get publish slide
noteRouter.get('/p/:shortid', response.showPublishSlide)
// publish slide actions
noteRouter.get('/p/:shortid/:action', response.publishSlideActions)
// get note by id
noteRouter.get('/:noteId', response.showNote)
// note actions
noteRouter.get('/:noteId/:action', response.noteActions)
// note actions with action id
noteRouter.get('/:noteId/:action/:actionId', response.noteActions)
