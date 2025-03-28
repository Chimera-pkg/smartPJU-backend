class BaseError extends Error {
  constructor(statusCode, message = "", payload = null) {
    super();

    this.code = statusCode;
    this.status = false;
    this.message = message;
    this.payload = payload;
  }
}

class ErrService extends BaseError {
  constructor(serviceName, error) {
    super(error.code, error.message, `${serviceName}ServiceError: ${error.payload}`);
  }
}

module.exports = {
  BaseError,
  ErrService
};