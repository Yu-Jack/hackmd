'use strict'

const httpProxy = require('http-proxy')
const Router = require('express').Router

const proxyOptions = {}
const proxy = httpProxy.createProxyServer(proxyOptions)

const proxyRouter = module.exports = Router()

proxyRouter.use('/remark', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8181/remark' })
})
