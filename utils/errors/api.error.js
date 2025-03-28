const {BaseError} = require("./index");

class ErrBadRequest extends BaseError {
  constructor(payload = {}) {
    super(400, `bad request`, payload);
  }
}

class ErrUnauthorized extends BaseError {
  constructor(error) {
    super(401, 'unauthorized', error);
  }
}

class ErrInternalServer extends BaseError {
  constructor(error) {
    super(500, `internal server error`, error);
  }
}

module.exports = {
  ErrBadRequest,
  ErrUnauthorized,
  ErrInternalServer
};