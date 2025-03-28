const {BaseError} = require("./index");

class MdbErrNotFound extends BaseError {
  constructor(collName) {
    super(400, `${collName} data not found`);
  }
}

class MdbErrNotUpdated extends BaseError {
  constructor(collName) {
    super(400, `${collName} data not updated`);
  }
}

class MdbErrInternal extends BaseError {
  constructor(collName, error) {
    super(500, 'internal server error', `${collName}MongoInternalError: ${error.message}`);
  }
}

class MdbExists extends BaseError {
  constructor(collName) {
    super(400, `${collName} data already exists`);
  }
}

class MdbNotDeleted extends BaseError {
  constructor(collName) {
    super(500, `${collName} data is not deleted`);
  }
}

class MdbErrNotValidObjectId extends BaseError {
  constructor(fieldName) {
    super(400, `${fieldName} is not valid`);
  }
}

module.exports = {
  MdbErrNotFound,
  MdbErrNotUpdated,
  MdbErrInternal,
  MdbExists,
  MdbNotDeleted,
  MdbErrNotValidObjectId
};
