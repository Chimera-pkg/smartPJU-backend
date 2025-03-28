const _ = require('lodash');
const {Response} = require("../utils/index");
const {mongoTx} = require("../utils/mongo.util");
const {
  flexiotLogin,
  getFlexiotDevices,
  fetchDeviceLastStatus,
  doAction
} = require("../services/flexiot.service");
const {ErrInternalServer} = require("../utils/errors/api.error");
const {getAllUser} = require("../services/user.service");
const {getAllRecordByDeviceLabelAndDate} = require("../services/record.service");
const {
  updateUpsertIotDeviceByMac,
  getAllIotDeviceDataByDeviceLabel
} = require("../services/iotDevice.service");
const mqtt = require("mqtt");
const {getFlexiotHeadersByFlexiotUserId} = require("../services/flexiot.token.service");
const {ErrValidation} = require("../utils/errors/validation.error");
const {setActionScheme} = require("../validator/device.validator");

const FLEXIOT_BRAND = "xcamp_dashboard";

const MQTT_CLIENT_POOL = new Map();


// do save history data
// async function SaveHistoryData(req, res, next) {
//   let err;
//
//   // clear client
//   for (const client of MQTT_CLIENT_POOL.values()) {
//     client.end();
//   }
//
//   // get all user
//   let users = await getAllUser().catch(e => err = e);
//   if (err) return next(err);
//
//   // return if no user
//   if (users.length === 0) return Response(res, true, 200, "no user found");
//
//   // remove duplicate flexiot emails
//   users = _.uniqBy(users, 'flexiot_email');
//
//   // iterate users
//   for (const user of users) {
//
//     // create MQTT client connection and add to MQTT_CLIENT_POOL
//     if (!MQTT_CLIENT_POOL.has(user._id)) {
//
//       // connect mqtt
//       const mqttClient = mqtt.connect(user.flexiot_mqtt_url, {
//         clientId: `dashboard-smart-pju_${user._id}`,
//         clean: true,
//         connectTimeout: 4000,
//         username: user.flexiot_mqtt_username,
//         password: user.flexiot_mqtt_password,
//         reconnectPeriod: 1000,
//       })
//
//       MQTT_CLIENT_POOL.set(user._id, mqttClient);
//     }
//
//     // create a reference of user's mqtt client
//     const clientRef = MQTT_CLIENT_POOL.get(user._id)
//
//     // on connect event handler
//     clientRef.on("connect", async () => {
//
//       // err object must be different because of event is bound to another process
//       let err2;
//
//       // do flexiot login
//       const [userData, headers] = await flexiotLogin(user._id).catch(e => err2 = e);
//       if (err2) return console.log("ERROR FLEXIOT LOGIN:", err2);
//
//       // get flexiot devices that match brand = FLEXIOT_BRAND
//       const flexiotDevices = await getFlexiotDevices(headers).catch(e => err2 = e);
//       const filteredFlexiotDevices = flexiotDevices
//         .filter(device => device.brand === FLEXIOT_BRAND)
//         .map(device => device.macAddress)
//
//       if (err2) return console.log("ERROR GETTING FLEXIOT DEVICES:", err2);
//
//       // on receive data event handler
//       clientRef.on("message", async (topic, payloadBuffer) => {
//
//         // err object must be different because of event is bound to another process
//         let err3;
//
//         const lastStatusData = JSON.parse(payloadBuffer.toString());
//
//         // check if current lastStatusData is device of filteredFlexiotDevices
//         if (filteredFlexiotDevices.includes(lastStatusData.mac)) {
//
//           // create payload
//           const indexOfDevice = flexiotDevices.findIndex(device => device.macAddress === lastStatusData.mac);
//           lastStatusData.flexiot_device_id = flexiotDevices[indexOfDevice].id;
//           lastStatusData.device_definition_id = flexiotDevices[indexOfDevice].deviceDefinitionId;
//           lastStatusData.name = flexiotDevices[indexOfDevice].name;
//           lastStatusData.zone_id = flexiotDevices[indexOfDevice].zoneId;
//           lastStatusData.timestamp = new Date().getTime();
//
//           // update device
//           await mongoTx(async (ctx) => {
//             await updateUpsertIotDeviceByMac(lastStatusData.mac, lastStatusData, ctx).catch(e => err3 = e);
//             if (err) return ctx.abortTransaction();
//           }).catch(e => err3 = e);
//
//           if (err3) return console.log("ERROR GETTING FLEXIOT DEVICES:", err3);
//         }
//
//       })
//
//       clientRef.subscribe(user.flexiot_mqtt_event_topic)
//     })
//
//   }
//
//   if (err) return next(err);
//
//   Response(res, true, 200, "successfully triggering MQTT realtime data handler")
// }

async function realtimeDataOnMessageHandler(parsedBuffer, filteredFlexiotDevices, flexiotDevices, headers) {

  // err object must be different because of event is bound to another process
  let err;

  // check if current lastStatusData is device of filteredFlexiotDevices
  if (filteredFlexiotDevices.includes(parsedBuffer.mac)) {

    const indexOfFlexiotDevice = flexiotDevices.findIndex(device => device.macAddress === parsedBuffer.mac);

    const lastDeviceData = await fetchDeviceLastStatus(flexiotDevices[indexOfFlexiotDevice].id, headers)
      .then(result => result.data.reduce((acc, item) => {
        if (item.parameter === "status") acc[item.parameter] = item.state;
        else acc[item.parameter] = item.value;
        return acc;
      }, {}))
      .catch(e => err = e);
    if (err) return console.log("ERROR GETTING LAST FLEXIOT DEVICE:", err);

    // create payload
    parsedBuffer.is_timer_mode = lastDeviceData.is_timer_mode;
    parsedBuffer.timer_started_at = lastDeviceData.started_at;
    parsedBuffer.timer_ended_at = lastDeviceData.ended_at;
    parsedBuffer.dimmer_value = lastDeviceData.dimmer_value;
    parsedBuffer.lamp_status = lastDeviceData.status;

    parsedBuffer.flexiot_device_id = flexiotDevices[indexOfFlexiotDevice].id;
    parsedBuffer.device_definition_id = flexiotDevices[indexOfFlexiotDevice].deviceDefinitionId;
    parsedBuffer.name = flexiotDevices[indexOfFlexiotDevice].name;
    parsedBuffer.zone_id = flexiotDevices[indexOfFlexiotDevice].zoneId;
    parsedBuffer.timestamp = new Date().getTime();

    // update device
    await mongoTx(async (ctx) => {
      await updateUpsertIotDeviceByMac(parsedBuffer.mac, parsedBuffer, ctx).catch(e => err = e);
      if (err) return ctx.abortTransaction();
    }).catch(e => err = e);

    if (err) return console.log("ERROR GETTING FLEXIOT DEVICE:", err);
  }
}

// do device realtime update
async function DeviceRealtimeUpdate(req, res, next) {
  let err;

  // clear client
  for (const client of MQTT_CLIENT_POOL.values()) {
    client.end();
  }

  // get all user
  let users = await getAllUser().catch(e => err = e);
  if (err) return next(err);

  // return if no user
  if (users.length === 0) return Response(res, true, 200, "no user found");

  // remove duplicate flexiot emails
  users = _.uniqBy(users, 'flexiot_email');

  // iterate users
  for (const user of users) {

    // create MQTT client connection and add to MQTT_CLIENT_POOL
    if (!MQTT_CLIENT_POOL.has(user._id)) {

      // connect mqtt
      const mqttClient = mqtt.connect(user.flexiot_mqtt_url, {
        clientId: `dashboard-smart-pju_${user._id}`,
        clean: true,
        connectTimeout: 4000,
        username: user.flexiot_mqtt_username,
        password: user.flexiot_mqtt_password,
        reconnectPeriod: 1000,
      })

      MQTT_CLIENT_POOL.set(user._id, mqttClient);
    }

    // create a reference of user's mqtt client
    const clientRef = MQTT_CLIENT_POOL.get(user._id)

    // on connect event handler
    clientRef.on("connect", async () => {

      // err object must be different because of event is bound to another process
      let err2;

      // do flexiot login
      const [userData, headers] = await flexiotLogin(user._id).catch(e => err2 = e);
      if (err2) return console.log("ERROR FLEXIOT LOGIN:", err2);

      // get flexiot devices that match brand = FLEXIOT_BRAND
      const flexiotDevices = await getFlexiotDevices(headers).catch(e => err2 = e);
      if (err2) return console.log("ERROR GETTING FLEXIOT DEVICES:", err2);

      const filteredFlexiotDevices = flexiotDevices
        .filter(device => device.brand === FLEXIOT_BRAND)
        .map(device => device.macAddress)

      // on receive data event handler
      clientRef.on("message", async (topic, payloadBuffer) => {

        const parsedBuffer = JSON.parse(payloadBuffer.toString());

        if (parsedBuffer.eventName === "smart_pju_data") {
          await realtimeDataOnMessageHandler(parsedBuffer, filteredFlexiotDevices, flexiotDevices, headers);
        }

      })

      clientRef.subscribe(user.flexiot_mqtt_event_topic)
    })
  }

  if (err) return next(err);

  Response(res, true, 200, "successfully triggering MQTT realtime data handler")
}

// get all device data
async function GetAllDeviceData(req, res, next) {
  const deviceLabel = req.params?.device_label;

  let err;

  // get device data
  const result = await getAllIotDeviceDataByDeviceLabel(deviceLabel).catch(e => err = e);
  if (err) return next(err);

  Response(res, true, 200, `Got ${result?.length} device`, result);
}

// get history data
async function GetHistoryData(req, res, next) {
  const deviceLabel = req.params?.device_label;

  let err;

  let result;

  await mongoTx(async (ctx) => {

    const CURRENT_DATE = new Date();

    // get records by device label and current month
    result = await getAllRecordByDeviceLabelAndDate(deviceLabel, CURRENT_DATE).catch(e => err = e);
    if (err) return ctx.abortTransaction();

  }).catch(e => err = new ErrInternalServer(e.stack));

  if (err) return next(err);

  Response(res, true, 200, `history data`, result);
}

// do device action
async function DeviceAction(req, res, next) {
  let err;

  const validatedPayload = await setActionScheme.validate(req.body).catch(e => err = new ErrValidation(e));
  if (err) return next(err);

  const headers = await getFlexiotHeadersByFlexiotUserId(validatedPayload.flexiot_user_id).catch(e => err = e);
  if (err) return next(err);

  const devices = await getAllIotDeviceDataByDeviceLabel(validatedPayload.device_label).catch(e => err = e);
  if (err) return next(err);

  const promises = devices.map(device => {
    if (!validatedPayload.action_param)
      return doAction(headers, validatedPayload.action_name, validatedPayload.flexiot_user_id, device.flexiot_device_id);
    else
      return doAction(headers, validatedPayload.action_name, validatedPayload.flexiot_user_id, device.flexiot_device_id, validatedPayload.action_param);
  });

  const result = await Promise.all(promises).catch(e => err = e);

  Response(res, true, 200, `successfully do action ${validatedPayload.action_name}`, result);
}

module.exports = {
  DeviceRealtimeUpdate,
  GetAllDeviceData,
  GetHistoryData,
  DeviceAction
}
