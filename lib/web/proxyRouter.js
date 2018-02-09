'use strict'

const httpProxy = require('http-proxy')
const Router = require('express').Router
const logger = require('../logger')
const config = require('../config')

const proxyOptions = {}
const proxy = httpProxy.createProxyServer(proxyOptions)

const proxyRouter = module.exports = Router()

proxyRouter.use('/remark', (req, res, next) => {
    proxy.web(req, res, { target: config.remarkEndpoint }, function(error) {
        logger.error('Error connect to Java server')
        logger.error(error)
        next(error)
    })
})
