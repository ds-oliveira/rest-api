// A method called User that returns a new object with the predefined properties every time it is called.
const User = (id, name, email) => ({
  id,
  name,
  email
})

// Exporting the model method.
module.exports = User