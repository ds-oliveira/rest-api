# Building a Rest API using Node.js, PM2, and Docker

Hello guys, this is a beginner level hands-on tutorial but is extremely recommended that you already had contact with javascript or some interpreted language with dynamic typing.

### What am I going to learn?
- How to create a Node.js Rest API application with Express.
- How to run multiple instances of a Node.js Rest API application and balance the load between them with PM2.
- How to build the application's image and run it in Docker Containers.

### Requirements
- Basic understanding of javascript
- Node.js version 10 or later - https://nodejs.org/en/download/
- npm version 6 or later - the Node.js installation already solves the npm dependency
- Docker 2.0 or later - https://www.docker.com/get-started
 
## Building the project's folder structure and installing the project's dependencies

WARNING: 
This tutorial was built using MacOs. Some things can diverge in other operational systems.

First of all, you'll need to create a directory for the project and create an npm project. So, in the terminal, we're going to create a folder and navigate inside it.
```
mkdir rest-api
cd rest-api
```

Now we're going to initiate a new npm project by typing the following command, and leaving blank the inputs by pressing enter:
```
npm init
```

If we take a look at the directory, we can see a new file named package.json. This file will be responsible for the management of our project's dependencies.

The next step is to create the project's folder structure. We're going to create the following structure:
```
- Dockerfile
- process.yml
- rest-api.js
- routes
  - index.js
- handlers
  - user
    - index.js
- services
  - user
    - index.js
- models
  - user
    - index.js
- commons
  - logger
    - index.js
```

We can do it easily by copying and pasting the following commands:
```
mkdir routes
mkdir -p handlers/user
mkdir -p services/user
mkdir -p models/user
mkdir -p commons/logger
touch Dockerfile
touch process.yml
touch rest-api.js
touch routes/index.js
touch handlers/user/index.js
touch services/user/index.js
touch models/user/index.js
touch commons/logger/index.js
```

Now that we've our project structure built, it's time to install some future dependencies of our project with the Node Package Manager (npm). Each dependency is a module needed in the application execution and must be available in the local machine. We'll need to install the following dependencies by using the following commands:
```
npm install express@4.16.4
npm install winston@3.2.1
npm install body-parser@1.18.3
sudo npm install pm2@3.5.0 -g
```
The '-g' option means that the dependency will be installed globally and the numbers after the '@' are the dependency version.

## Please, open your favorite editor, cause it's time to code!

Firstly, we're going to create our logger module, to log our application behaviors.

### `rest-api/commons/logger/index.js`

```
// Getting the winston module
const winston = require('winston')

// Creating a logger that will print the application`s behavior in the console
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

// Exporting the logger object to be used as a module by all of the application
module.exports = logger
```

Models can help you to identify what's the structure of an object you're working with dynamically typed languages, so let's create a model named User.

### `rest-api/models/user/index.js`

```
// A method called User that returns a new object with the predefined properties every time it is called.
const User = (id, name, email) => ({
  id,
  name,
  email
})

// Exporting the model method.
module.exports = User
```

It's time to build our service module, with its methods!

### `rest-api/services/user/index.js`

```
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
```

Let's create our request handlers.

### `rest-api/handlers/user/index.js`

```
// Importing some modules that we created before.
const userService = require('../../services/user')
const logger = require('../../commons/logger')
const User = require('../../models/user')

// Handlers are responsible for managing the request and response objects, and link them to a service module that will do the hard work.
// Each of the following handlers has the req and res parameters, which stands for request and response. 
// Each handler of this module represents an HTTP verb (GET, POST, PUT and DELETE) that will be linked to them in the future through a router.

// GET
const getUserById = (req, res) => {
  try {
    const users = userService.getUserById(parseInt(req.params.id))
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
    const users = userService.insertUser(user)
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
    const users = userService.updateUser(user)
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
    const users = userService.deleteUserById(parseInt(req.params.id))
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
```

Now, we're going to set up our HTTP routes.

### `rest-api/routes/index.js`

```
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
```

Finally, it's time to build our application layer.

### `rest-api/rest-api.js`

```
// Importing the Rest API framework.
const express = require('express')

// Importing a module that converts the request body in a JSON.
const bodyParser = require('body-parser')

// Importing our logger module
const logger = require('./commons/logger')

// Importing our router object
const router = require('./routes')

// Port that will receive the requests
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
```

## Running our application
Inside the directory `rest-api/` type the following code to run our application:
```
node rest-api.js
```
You should see a message like the following in your terminal window:

`{"message":"API Listening on port: 3000","level":"info"}`

The message above means that our Rest API is running, so let's open another terminal and make some test calls with curl:
```
curl localhost:3000/user/1
curl -X POST localhost:3000/user -d '{"id":5, "name":"Danilo Oliveira", "email": "danilo.oliveira@email.com"}' -H "Content-Type: application/json"
curl -X PUT localhost:3000/user -d '{"id":2, "name":"Danilo Oliveira", "email": "danilo.oliveira@email.com"}' -H "Content-Type: application/json"
curl -X DELETE localhost:3000/user/2
```

## Configuring and Running the PM2
Since everything worked fine, it's time to configure a PM2 service in our application. For this, we'll need to go to a file we created on the start of this tutorial `rest-api/process.yml` and implement the following configuration structure:
```
apps:
  - script: rest-api.js             # Application's startup file name
    instances: 4                    # Number of processes that must run in parallel, you can change this if you want
    exec_mode: cluster              # Execution mode
```

Now, we're going to turn on our PM2 service, make sure that our Rest API isn't running anywhere before execute the following command, cause we need the port 3000 free.
```
pm2 start process.yml
```
You should see a table showing some instances with `App Name = rest-api` and `status = online`, if so, it's time to test our load balancing. To make this test we're going to type the following command and open another terminal to make some requests:
### `Terminal 1`
```
pm2 logs
```
### `Terminal 2`
```
curl localhost:3000/user/1
curl -X POST localhost:3000/user -d '{"id":5, "name":"Danilo Oliveira", "email": "danilo.oliveira@email.com"}' -H "Content-Type: application/json"
curl -X PUT localhost:3000/user -d '{"id":2, "name":"Danilo Oliveira", "email": "danilo.oliveira@email.com"}' -H "Content-Type: application/json"
curl -X DELETE localhost:3000/user/2
```

In the `Terminal 1` you should see by the logs, your request being balanced through the multiple instances of our application, the numbers on the start of each row are the instances ids:
```
2|rest-api  | {"message":"User Updated","level":"info"}
3|rest-api  | {"message":"User Updated","level":"info"}
0|rest-api  | {"message":"User Updated","level":"info"}
1|rest-api  | {"message":"User Updated","level":"info"}
2|rest-api  | {"message":"User Deleted","level":"info"}
3|rest-api  | {"message":"User Inserted","level":"info"}
0|rest-api  | {"message":"User Retrieved","level":"info"}
```
