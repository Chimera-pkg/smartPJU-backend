const {ErrNeedParam} = require("../utils/errors/validation.error");
const {flexApi} = require("../utils/httpReq.util");
const {FlexiotError} = require("../utils/errors/flexiot.error");
const {getUserById} = require("./user.service");
const {getFlexiotToken} = require("./flexiot.token.service");

async function appAuth(xSecret) {
  if (!xSecret) throw new ErrNeedParam("X Secret");

  const headers = {"X-Secret": xSecret}

  let err;
  const response = await flexApi.get('/applicationmgt/authenticate', {headers})
    .catch(e => Promise.reject(FlexiotError(e)));
  if (err) throw err

  return response.data
}

async function userAuth(accessToken, username, password) {
  if (!accessToken) throw new ErrNeedParam("access token");
  if (!username) throw new ErrNeedParam("username");
  if (!password) throw new ErrNeedParam("password");

  const data = {username, password};
  const headers = {"Authorization": `Bearer ${accessToken}`}

  let err;
  const response = await flexApi.post(`/usermgt/v1/authenticate`, data, {headers})
    .catch(e => Promise.reject(FlexiotError(e)));
  if (err) throw err;

  return response.data
}

async function doFlexiotAuth(xSecret, username, password) {
  let err;
  const _appAuth = await appAuth(xSecret).catch(e => err = e);
  if (err) throw err;
  const {access_token} = _appAuth;

  const userAuthResult = await userAuth(access_token, username, password).catch(e => err = e);
  if (err) throw err;

  return {
    "X-IoT-JWT": userAuthResult["X-IoT-JWT"],
    Authorization: `Bearer ${access_token}`
  }
}

// do Flexiot Login
// returns [user data, flexiot headers]
async function flexiotLogin(userId, session) {
  let err;

  // get user data
  const userData = await getUserById(userId, session).catch(e => err = e);
  if (err) throw err;

  // get flexiot authentication token
  const flexiotAuth = await getFlexiotToken(userData.flexiot_email).catch(e => err = e);
  if (err) throw err;

  // parse flexiot headers
  const headers = {
    Authorization: flexiotAuth.Authorization,
    "X-IoT-JWT": flexiotAuth["X-IoT-JWT"]
  }

  return [userData, headers];
}

async function getFlexiotDevices(headers = {Authorization: "", "X-IoT-JWT": ""}) {
  let err;
  const response = await flexApi
    .get('/userdevicemgt/v1/devices', {headers})
    .catch(e => Promise.reject(FlexiotError(e)));
  if (err) throw err;

  return response.data
}

function fetchDeviceLastStatus(deviceId = "", headers = {Authorization: "", "X-IoT-JWT": ""}) {
  return flexApi
    .get(`/userdevicemgt/v1/devices/${deviceId}/status`, {headers})
    .then(resp => ({
      device_id: deviceId,
      data: resp.data
    }))
    .catch(e => Promise.reject(FlexiotError(e)))
}

// get all flexiot device status
// returns [results, nDevicesAreNotAvailable]
async function getAllFlexiotLastDeviceData(deviceIds = [], headers = {Authorization: "", "X-IoT-JWT": ""}) {
  let err;

  let nDevicesAreNotAvailable = 0;

  const promises = deviceIds.map(id => fetchDeviceLastStatus(id, headers));
  const results = await Promise
    .allSettled(promises)
    .then(pResults => pResults.map(pResult => {
      if (pResult.status === "fulfilled")
        return pResult.value;
      else
        nDevicesAreNotAvailable += 1;
    }))
    .catch(e => err = e);
  if (err) throw err;

  return [results, nDevicesAreNotAvailable];
}

async function getFlexiotHistoryData(deviceIds = [], startDate, endDate, headers = {
  Authorization: "",
  "X-IoT-JWT": ""
}) {

  const params = {
    eventName: "smart_pju_data",
    deviceIds: deviceIds.toString(),
    // startDate: "",
    // endDate: "",
    noOfEvents: 1000,
    zoneId: "Asia/Jakarta",
  }

  return flexApi
    .get(`/datamgt/v1/user/devicehistory`, {params, headers})
    .catch(e => Promise.reject(FlexiotError(e)))
}

async function doAction(headers, actionName = "", userId = 0, deviceId = "", params) {
  if (!actionName) throw new ErrNeedParam("action name");
  if (!userId) throw new ErrNeedParam("user id");
  if (!deviceId) throw new ErrNeedParam("device id");

  // action payload
  const actionPayload = {
    operation: "deviceControl",
    deviceId,
    actionName,
    userId,
  }

  // set params if exists
  if (params) actionPayload.actionParameters = params

  return await flexApi.post('/userdevicecontrol/v1/devices/executeaction', actionPayload, {headers})
    .then(r => r.data)
    .catch(e => Promise.reject(FlexiotError(e)));
}


module.exports = {
  appAuth,
  userAuth,
  doFlexiotAuth,
  flexiotLogin,
  getFlexiotDevices,
  fetchDeviceLastStatus,
  getAllFlexiotLastDeviceData,
  getFlexiotHistoryData,
  doAction
}
