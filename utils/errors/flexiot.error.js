const {BaseError} = require("./index");

class ErrFlexiotDeviceNotFound extends BaseError {
  constructor() {
    super(400, 'flexiot device not found');
  }
}

class ErrUnknownFlexiotError extends BaseError {
  constructor(error = {}) {
    super(500, 'unknown flexiot error', error?.response?.data);
  }
}

const errorList = {
  "2100": new ErrFlexiotDeviceNotFound(),
};

function FlexiotError(error) {
  console.log("flexiotError:", error)
  return errorList[error?.response?.data?.errorCode + ""] ?? new ErrUnknownFlexiotError(error)
}

module.exports = {
  ErrFlexiotDeviceNotFound,
  ErrUnknownFlexiotError,
  FlexiotError
}
