const Cryptr = require('cryptr');

// crypto obj
const c = new Cryptr('ReallySecretKey');

function encryptPassword(rawPassword) {
  return c.encrypt(rawPassword)
}

function decryptPassword(encryptedPassword) {
  return c.decrypt(encryptedPassword)
}


module.exports = {
  encryptPassword,
  decryptPassword
}
