const {BaseError} = require("./index");

class ErrValidation extends BaseError {
  constructor(error) {
    super(400, error.message);
  }
}

class ErrNeedParam extends BaseError {
  constructor(paramName) {
    super(400, `missing ${paramName}`);
  }
}

class ErrAxios extends BaseError {
  constructor(error) {
    const err = {code: error?.response?.status, message: error?.response?.statusText,
      payload: error?.response?.data
    }
    super(err.code || 500, err.message || `axios error`,
      err.payload
    );
  }
}

module.exports = {
  ErrValidation,
  ErrNeedParam,
  ErrAxios,
};
