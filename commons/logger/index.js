// Getting the winston module.
const winston = require('winston')

// Creating a logger that will print the application`s behavior in the console.
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

// Exporting the logger object to be used as a module by the whole application.
module.exports = logger