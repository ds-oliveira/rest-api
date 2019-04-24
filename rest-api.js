// Importing the Rest API framework.
const express = require('express')

// Importing a module that converts the request body in a JSON.
const bodyParser = require('body-parser')

// Importing our logger module
const logger = require('./commons/logger')

// Importing our router object
const router = require('./routes')

// The port that will receive the requests
const restApiPort = 3000

// Initializing the Express framework
const app = express()

// Keep the order, it's important
app.use(bodyParser.json())
app.use(router)

// Making our Rest API listen to requests on the port 3000
app.listen(restApiPort, () => {
  logger.info(`API Listening on port: ${restApiPort}`)
})