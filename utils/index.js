function Response(res, success, code, message, payload) {
  return res.status(code).send({
    success: success,
    code: code,
    message: message,
    values: payload
  });
}


module.exports = {
  Response,
}
