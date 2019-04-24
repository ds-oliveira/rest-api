// Importing the User model factory method.
const User = require('../../models/user')

// Creating a fake list of users to eliminate database consulting.
const mockedUserList = [
  User(1, 'John Smith', 'john.smith@email.com'),
  User(2, 'Daniel Ackles', 'daniel.ackles@email.com'),
  User(3, 'Phill Damon', 'phill.damon@email.com')
]

// Method that returns if an Id is higher than other Id.
const sortById = (x, y) => x.id > y.id

// Method that returns a list of users that match an specific Id.
const getUserById = (id) => mockedUserList.filter(user => user.id === id).sort(sortById)

// Method that adds a new user to the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const insertUser = (newUser) => {
  const usersList = [
    ...mockedUserList,
    newUser
  ]

  return usersList.sort(sortById)
}

// Method that updates an existent user of the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const updateUser = (userToBeUpdated) => {
  const usersList = [
    ...mockedUserList.filter(user => user.id !== userToBeUpdated.id),
    userToBeUpdated
  ]

  return usersList.sort(sortById)
}

// Method that removes an existent user from the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const deleteUserById = (id) => mockedUserList.filter(user => user.id !== id).sort(sortById)

// Exporting the methods of the service module.
module.exports = {
  getUserById,
  insertUser,
  updateUser,
  deleteUserById
}