// Importing the User model factory method.
const User = require('../../models/user')

// Creating a fake list of users to eliminate database consulting.
const mockedUserList = [
  User(1, 'John Smith', 'john.smith@email.com'),
  User(2, 'Daniel Ackles', 'daniel.ackles@email.com'),
  User(3, 'Phill Damon', 'phill.damon@email.com')
]

// Creating a method that returns the mockedUserList.
const getUsers = () => mockedUserList

// Exporting the methods of the repository module.
module.exports = {
  getUsers
}