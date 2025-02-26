const express = require("express")
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const {createProxyMiddleware} = require("http-proxy-middleware")
const middilewares = [
    morgan("dev"),
    express.static('public'),
    bodyParser.urlencoded({extended: true}),
    bodyParser.json(),
    cors({
        origin: '*',
        
    })

]

module.exports = app => {
    middilewares.forEach(m => {
        app.use(m)
    })
    
}