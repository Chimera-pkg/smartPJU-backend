const {IotDevice} = require("../models/iotDevice.model");

async function getIotDeviceById(iotDeviceId, session) {
  const query = IotDevice.findOne({_id: iotDeviceId});
  return session ? query.session(session) : query;
}

async function getIotDeviceByFlexiotDeviceId(flexiotDeviceId, session) {
  const query = IotDevice.findOne({flexiot_device_id: flexiotDeviceId});
  return session ? query.session(session) : query;
}

async function getAllIotDeviceByIds(iotDeviceIds, session) {
  const query = IotDevice.findOne({_id: {$in: iotDeviceIds}});
  return session ? query.session(session) : query;
}

async function getAllIotDeviceByFlexiotDeviceIds(flexiotDeviceIds, session) {
  const query = IotDevice.findOne({flexiot_device_id: {$in: flexiotDeviceIds}});
  return session ? query.session(session) : query;
}

async function getAllIotDeviceByDashboardId(dashboardId, session) {
  const query = IotDevice.find({dashboard_id: dashboardId});
  return session ? query.session(session) : query;
}

async function getAllIotDeviceByDeviceLabel(deviceLabel, session) {
  const query = IotDevice.find({device_label: deviceLabel});
  return session ? query.session(session) : query;
}

async function getIotDeviceByName(iotDeviceName, session) {
  const query = IotDevice.findOne({name: iotDeviceName});
  return session ? query.session(session) : query;
}

async function getIotDeviceByNameOrDeviceLabel(iotDeviceName, deviceLabel, session) {
  const query = IotDevice.findOne({
    $or: [
      {name: iotDeviceName},
      {device_label: deviceLabel}
    ]
  });
  return session ? query.session(session) : query;
}

async function getIotDeviceByUserId(userId, session) {
  const query = IotDevice.findOne({user_id: userId});
  return session ? query.session(session) : query;
}

async function getIotDeviceByUserIdAndIotDeviceId(userId, iotDeviceId, session) {
  const query = IotDevice.findOne({_id: iotDeviceId, user_id: userId});
  return session ? query.session(session) : query;
}

async function getAllIotDevice(session) {
  const query = IotDevice.find();
  return session ? query.session(session) : query;
}

async function getAllIotDeviceByUserId(userId, session) {
  const query = IotDevice.find({user_id: userId});
  return session ? query.session(session) : query;
}

async function createIotDevice(payload, session) {
  const opt = session ? {session} : {};
  return IotDevice.create([payload], opt);
}

async function updateIotDeviceById(iotDeviceId, updatePayload, session) {
  const query = IotDevice.updateOne({_id: iotDeviceId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateUpsertIotDeviceByMac(macAddress, updatePayload, session) {
  const query = IotDevice.updateOne({mac: macAddress}, {
    $set: updatePayload
  }, {upsert: true});
  return session ? query.session(session) : query;
}

async function updateIotDeviceByIdAndUserId(iotDeviceId, userId, updatePayload, session) {
  const query = IotDevice.updateOne({_id: iotDeviceId, user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateIotDeviceByUserId(userId, updatePayload, session) {
  const query = IotDevice.updateOne({user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function deleteIotDeviceById(iotDeviceId, session) {
  const query = IotDevice.deleteOne({_id: iotDeviceId});
  return session ? query.session(session) : query;
}

async function deleteIotDeviceByFlexiotDeviceId(flexiotDeviceId, session) {
  const query = IotDevice.deleteOne({flexiot_device_id: flexiotDeviceId});
  return session ? query.session(session) : query;
}

async function deleteIotDeviceByUserId(userUd, session) {
  const query = IotDevice.deleteOne({user_id: userUd});
  return session ? query.session(session) : query;
}

module.exports = {
  getIotDeviceById,
  getIotDeviceByFlexiotDeviceId,
  getAllIotDeviceByIds,
  getAllIotDeviceByFlexiotDeviceIds,
  getAllIotDeviceByDashboardId,
  getAllIotDeviceByDeviceLabel,
  getIotDeviceByName,
  getIotDeviceByNameOrDeviceLabel,
  getIotDeviceByUserId,
  getIotDeviceByUserIdAndIotDeviceId,
  getAllIotDevice,
  getAllIotDeviceByUserId,
  createIotDevice,
  updateIotDeviceById,
  updateUpsertIotDeviceByMac,
  updateIotDeviceByIdAndUserId,
  updateIotDeviceByUserId,
  deleteIotDeviceById,
  deleteIotDeviceByFlexiotDeviceId,
  deleteIotDeviceByUserId
}
