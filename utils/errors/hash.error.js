const {BaseError} = require("./index");

class ErrHashPassword extends BaseError {
  constructor(error) {
    super(500, `Error hashing password: ${error.message}`);
  }
}

module.exports = {
  ErrHashPassword
};