const ejs = require('ejs')
const path = require('path')
const fs = require('fs')

exports.verifyTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, 'templates/verify.ejs'), 'utf8'))