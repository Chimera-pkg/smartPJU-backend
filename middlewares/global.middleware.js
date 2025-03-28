const expressWinston = require("express-winston");
const winston = require("winston");

function headerMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
}

const loggerMiddleware = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function () {
    return false;
  }
})


module.exports = {
  headerMiddleware,
  loggerMiddleware
}