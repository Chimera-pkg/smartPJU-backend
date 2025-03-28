const axios = require("axios");
const {ErrAxios} = require("../utils/errors/validation.error");

async function doAxios(URI, axiosOpt) {
  let err;
  const responseData = await axios(URI, axiosOpt)
    .then(d => d.data)
    .catch(e => err = new ErrAxios(e));
  if (err) throw err;
  return responseData
}

module.exports = {
  doAxios
}