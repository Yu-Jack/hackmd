'use strict'

const httpProxy = require('http-proxy')
const Router = require('express').Router
const logger = require('../logger')

const proxyOptions = {}
const proxy = httpProxy.createProxyServer(proxyOptions)

const proxyRouter = module.exports = Router()

proxyRouter.use('/remark', (req, res, next) => {
    proxy.web(req, res, { target: 'http://localhost:8181/remark' }, function(error) {
        logger.error('Error connect to Java server')
        logger.error(error)
        next(error)
    })
})
