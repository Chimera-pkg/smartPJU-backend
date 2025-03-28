const {Response} = require('../utils/index')

function errorResponder(err, req, res, next) {
  return Response(res, err.status, err.code, err.message, err.payload);
}

module.exports = {
  errorResponder
}