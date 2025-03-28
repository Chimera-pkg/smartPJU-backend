const {BaseError} = require("./index");

class ErrIncorrectPassword extends BaseError {
  constructor(error) {
    super(401, "incorrect password", error);
  }
}

class ErrUserNotFound extends BaseError {
  constructor(error) {
    super(401, "user not found", error);
  }
}

class ErrUserExists extends BaseError {
  constructor(error) {
    super(401, "user already exists", error);
  }
}

module.exports = {
  ErrIncorrectPassword,
  ErrUserNotFound,
  ErrUserExists
};