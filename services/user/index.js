// Method that returns if an Id is higher than other Id.
const sortById = (x, y) => x.id > y.id

// Method that returns a list of users that match an specific Id.
const getUserById = (repository, id) => repository.getUsers().filter(user => user.id === id).sort(sortById)

// Method that adds a new user to the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const insertUser = (repository, newUser) => {
  const usersList = [
    ...repository.getUsers(),
    newUser
  ]

  return usersList.sort(sortById)
}

// Method that updates an existent user of the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const updateUser = (repository, userToBeUpdated) => {
  const usersList = [
    ...repository.getUsers().filter(user => user.id !== userToBeUpdated.id),
    userToBeUpdated
  ]

  return usersList.sort(sortById)
}

// Method that removes an existent user from the fake list and returns the updated fake list, note that there isn't any persistence,
// so the data returned by future calls to this method will always be the same.
const deleteUserById = (repository, id) => repository.getUsers().filter(user => user.id !== id).sort(sortById)

// Exporting the methods of the service module.
module.exports = {
  getUserById,
  insertUser,
  updateUser,
  deleteUserById
}