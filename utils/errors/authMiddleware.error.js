const {BaseError} = require("./index");

class EBearerNotString extends BaseError {
  constructor(error) {
    super(401, "bearer token is not a string", error);
  }
}

class EBearerNotValid extends BaseError {
  constructor(error) {
    super(401, "bearer token is not a valid", error);
  }
}

module.exports = {
  EBearerNotString,
  EBearerNotValid,
};