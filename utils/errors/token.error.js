const {BaseError} = require("./index");

class ErrInvalidSession extends BaseError {
  constructor(error) {
    super(401, "invalid session", error);
  }
}

module.exports = {
  ErrInvalidSession,
};