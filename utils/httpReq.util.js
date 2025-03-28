const axios = require('axios').default;

const ROOT_URI = "http://localhost:5000"
const FLEXIOT_ROOT_URI = "https://iot.dialog.lk/developer/api"

const flexApi = axios.create({
  baseURL: FLEXIOT_ROOT_URI,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

const Api = axios.create({
  baseURL: ROOT_URI,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

module.exports = {
  flexApi,
  Api
}
