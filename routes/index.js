// Importing our handlers module.
const userHandler = require('../handlers/user')

// Importing an express object responsible for routing the requests from urls to the handlers.
const router = require('express').Router()

// Adding routes to the router object.
router.get('/user/:id', userHandler.getUserById)
router.post('/user', userHandler.insertUser)
router.put('/user', userHandler.updateUser)
router.delete('/user/:id', userHandler.deleteUserById)

// Exporting the configured router object.
module.exports = router