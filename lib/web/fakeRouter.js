'use strict'

const Router = require('express').Router
const bodyParser = require('body-parser')
const router = module.exports = Router()

const notes = {
  1: {
    'status': 0,
    'shortid': 'S1yiVOw8z'
  },
  2: {
    'status': 0,
    'shortid': 'BJzuHOD8G'
  },
  3: {
    'status': 0,
    'shortid': 'HJ8YrdDLM'
  },
  4: {
    'status': 0,
    'shortid': 'BJR0B_DUG'
  }
}

router.use(bodyParser.json())

router.post('/get-board-list', (req, res) => {
  res.json({
    'status': 0,
    'msg': 'String',
    'boards': [{
      'id': 1,
      name: 'Tappay Engineer'
    }]
  })
})

router.post('/get-root-notes', (req, res) => {
  res.json({
    'status': 0,
    'msg': 'String',
    'root-notes': [{
        'id': 1,
        'name': 'Main Server',
      },
      {
        'id': 2,
        'name': 'Portal'
      }
    ]
  })
})

router.post('/get-sub-notes', (req, res) => {
  res.json({
    'status': 0,
    'msg': 'String',
    'sub-notes': [{
        'id': 3,
        'name': '新官網'
      },
      {
        'id': 4,
        'name': '新 Portal'
      }
    ]

  })
})

router.post('/get-note', (req, res) => {
    res.json(notes[req.body.id])
})
