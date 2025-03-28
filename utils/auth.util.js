const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashPassword(rawPassword, saltRounds = 10) {
  return bcrypt.hash(rawPassword, saltRounds);
}

async function comparePassword(rawPassword, hashedPassword) {
  return bcrypt.compare(rawPassword, hashedPassword);
}

function generateAuthToken(payload, expTimespan = "2h") {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expTimespan})
}

async function verifyAuthToken(jwtPayload) {
  return jwt.verify(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {})
}

function decodeAuthToken(jwtPayload) {
  return jwt.decode(jwtPayload, {})
}


module.exports = {
  hashPassword,
  comparePassword,
  generateAuthToken,
  verifyAuthToken,
  decodeAuthToken
}