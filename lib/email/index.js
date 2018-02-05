// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
const config = require('../config')
const ejs = require('ejs')
const path = require('path')
const {
  verifyTemplate
} = require('./utils')

sgMail.setApiKey(config.sendgrid.apiKey)


exports.verifyCode = function (email, code, callback) {
  const msg = {
    to: email,
    from: {
      name: 'TapMD',
      email: 'tapmd@tsaipowu.com'
    },
    subject: '註冊驗證碼',
    text: `驗證碼是 ${code}`,
    html: verifyTemplate({
      code: code,
      account: email.split('@')[0]
    }),
  };
  sgMail.send(msg)
    .then(() => {
      //Celebrate
      callback()
    })
    .catch((error) => {

      //Log friendly error
      console.error(error.toString());

      //Extract error msg
      const {
        message,
        code,
        response
      } = error

      //Extract response msg
      const {
        headers,
        body
      } = response

      callback(error)
    })
}
