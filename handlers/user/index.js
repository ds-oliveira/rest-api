// Importing some modules that we created before.
const userService = require('../../services/user')
const repository = require('../../repository/user-mock-repository')
const logger = require('../../commons/logger')
const User = require('../../models/user')

// Handlers are responsible for managing the request and response objects, and link them to a service module that will do the hard work.
// Each of the following handlers has the req and res parameters, which stands for request and response. 
// Each handler of this module represents an HTTP verb (GET, POST, PUT and DELETE) that will be linked to them in the future through a router.

// GET
const getUserById = (req, res) => {
  try {
    const users = userService.getUserById(repository, parseInt(req.params.id))
    logger.info('User Retrieved')
    res.send(users)
  } catch (err) {
    logger.error(err.message)
    res.send(err.message)
  }
}

// POST
const insertUser = (req, res) => {
  try {
    const user = User(req.body.id, req.body.name, req.body.email)
    const users = userService.insertUser(repository, user)
    logger.info('User Inserted')
    res.send(users)
  } catch (err) {
    logger.error(err.message)
    res.send(err.message)
  }
}

// PUT
const updateUser = (req, res) => {
  try {
    const user = User(req.body.id, req.body.name, req.body.email)
    const users = userService.updateUser(repository, user)
    logger.info('User Updated')
    res.send(users)
  } catch (err) {
    logger.error(err.message)
    res.send(err.message)
  }
}

// DELETE
const deleteUserById = (req, res) => {
  try {
    const users = userService.deleteUserById(repository, parseInt(req.params.id))
    logger.info('User Deleted')
    res.send(users)
  } catch (err) {
    logger.error(err.message)
    res.send(err.message)
  }
}

// Exporting the handlers.
module.exports = {
  getUserById,
  insertUser,
  updateUser,
  deleteUserById
}