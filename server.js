"use strict";
const express = require('express')
const app = express()
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080,
    server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
const bruinMessenger = require('./app')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// set the view engine to handlebars
app.use(express.static('public'))
app.set('view engine', 'hbs')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// logging
app.use(morgan('combined'))

// include session middleware
app.use(bruinMessenger.session)

// Register our bruinMessenger routes
app.use('/', bruinMessenger.router)

// 404 for all unregistered routes
app.use((req, res, next) => {
  res.status(404).render('404')
})

/**
 * Set up the ioServer and listen on port `port`
 */
bruinMessenger.ioServer(app).listen(port, server_ip_address,() => {
	console.log("Started BruinMessenger on port", port);
});