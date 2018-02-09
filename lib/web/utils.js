'use strict'

const bodyParser = require('body-parser')

// create application/x-www-form-urlencoded parser
exports.urlencodedParser = bodyParser.urlencoded({
  extended: false,
  limit: 1024 * 1024 * 10 // 10 mb
})

// create text/markdown parser
exports.markdownParser = bodyParser.text({
  inflate: true,
  type: ['text/plain', 'text/markdown'],
  limit: 1024 * 1024 * 10 // 10 mb
})

// create application/json parser
exports.jsonParser = bodyParser.json({
  limit: 1024 * 1024 * 10 // 10 mb
})

/**
 * Returns a route handler for Express that calls the passed in function
 * @param  {Function} fn The asynchronous the route needs to call
 * @return {Promise}
 */
exports.wrap = function(fn) {
  if (fn.length <= 3) {
    return function(req, res, next) {
      return fn(req, res, next).catch(next);
    };
  } else {
    return function(err, req, res, next) {
      return fn(err, req, res, next).catch(next);
    };
  }
}
