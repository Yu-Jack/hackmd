'use strict'

const Router = require('express').Router
const passport = require('passport')
const validator = require('validator')
const scrypt = require('scrypt')
const sendMail = require('../../../email')
const LocalStrategy = require('passport-local').Strategy
const config = require('../../../config')
const models = require('../../../models')
const logger = require('../../../logger')
const {setReturnToFromReferer} = require('../utils')
const {urlencodedParser} = require('../../utils')
const response = require('../../../response')

let emailAuth = module.exports = Router()

passport.use(new LocalStrategy({
  usernameField: 'email'
}, function (email, password, done) {
  if (!validator.isEmail(email)) return done(null, false)
  models.User.findOne({
    where: {
      email: email
    }
  }).then(function (user) {
    if (!user) return done(null, false)
    if (!user.verifyPassword(password)) return done(null, false)
    return done(null, user)
  }).catch(function (err) {
    logger.error(err)
    return done(err)
  })
}))

if (config.allowemailregister) {
  emailAuth.post('/register', urlencodedParser, function (req, res, next) {
    if (!req.body.account || !req.body.password) return response.errorBadRequest(res)
    const email = `${req.body.account}@cherri.tech`
    if (!validator.isEmail(email)) return response.errorBadRequest(res)

    models.User.findOne({
      where: {
        email: email
      }
    }).then(function (user) {
      if (user) {
        req.flash('error', 'email 已存在，請登入或者換其他 email')
        return res.redirect(config.serverurl + '/')
      }
      req.session.code = String(Math.random()).substring(2, 8)
      req.session.password = scrypt.kdfSync(req.body.password, scrypt.paramsSync(0.1)).toString('hex')
      req.session.email = email
      sendMail.verifyCode(email, req.session.code, function (err) {
        if (err) {
          req.flash('error', '錯誤代碼11111，請聯絡客服')
          return res.redirect(config.serverurl + '/')
        }

        res.redirect('/register/verify')
      })
    }).catch(function (err) {
      logger.error(err)
      return response.errorInternalError(res)
    })
  })

  emailAuth.get('/register/verify', function (req, res, next) {
    res.render('./verify', {
      errorMessage: req.flash('error')
    })
  })

  emailAuth.post('/register/verify', urlencodedParser, function (req, res, next) {
    if (req.session.code !== req.body.code) {
      req.flash('error', 'email 驗證碼錯誤，請重新輸入')
      return res.redirect('/register/verify')
    }

    models.User.findOrCreate({
      where: {
        email: req.session.email
      },
      defaults: {
        password: req.session.password
      }
    }).spread(function (user, created) {
      if (user) {
        if (created) {
          logger.debug('user registered: ' + user.id)
          req.flash('info', "You've successfully registered, please signin.")
        } else {
          logger.debug('user found: ' + user.id)
          req.flash('error', 'This email has been used, please try another one.')
        }
        return res.redirect(config.serverurl + '/')
      }
      req.flash('error', 'Failed to register your account, please try again.')
      return res.redirect(config.serverurl + '/')
    }).catch(function (err) {
      logger.error('auth callback failed: ' + err)
      return response.errorInternalError(res)
    })
  })
}

emailAuth.post('/login', urlencodedParser, function (req, res, next) {
  if (!req.body.account || !req.body.password) return response.errorBadRequest(res)
  const email = `${req.body.account}@cherri.tech`
  if (!validator.isEmail(email)) return response.errorBadRequest(res)

  setReturnToFromReferer(req)
  req.body.email = email
  passport.authenticate('local', {
    successReturnToOrRedirect: config.serverurl + '/',
    failureRedirect: config.serverurl + '/',
    failureFlash: 'Invalid email or password.'
  })(req, res, next)
})
