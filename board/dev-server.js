// const path = require()
const { Nuxt, Builder } = require('nuxt')
const config = require('./nuxt.config.js')

config.rootDir = __dirname

// remove baseUrl in when run as express middleware
// delete config.env.baseUrl
// delete config.router.base

const nuxt = new Nuxt(config)

// build nuxt
new Builder(nuxt).build().catch((error) => {
  console.log('failed to build nuxt')
  console.log(error)
  process.exit(1)
})

module.exports = nuxt.render
