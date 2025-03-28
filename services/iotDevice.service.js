const iotDeviceColl = require("../collections/iotDevice.coll");
const {
  MdbErrInternal,
  MdbExists,
  MdbNotDeleted,
  MdbErrNotFound,
  MdbErrNotUpdated
} = require("../utils/errors/mongodb.error");
const {ErrInternalServer} = require("../utils/errors/api.error");

const POWER_OFF_STATE = 20;

async function createIotDevice(payload, session) {
  let err;

  if (!payload) throw new ErrInternalServer("missing payload")

  // check iotDevice by flexiot device id
  const iotDeviceData = await iotDeviceColl
    .getIotDeviceByFlexiotDeviceId(payload.flexiot_device_id, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (iotDeviceData) throw new MdbExists('iotDevice');

  // create iotDevice
  const createResult = await iotDeviceColl.createIotDevice(payload, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;

  return createResult;
}

async function deleteIotDeviceById(iotDeviceId, session) {
  let err;

  if (!iotDeviceId) throw new ErrInternalServer("missing iotDevice_id")

  const {deletedCount} = await iotDeviceColl.deleteIotDeviceById(iotDeviceId, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (deletedCount === 0) throw new MdbNotDeleted("iotDevice");
}

async function deleteIotDeviceByFlexiotDeviceId(flexiotDeviceId, session) {
  let err;

  if (!flexiotDeviceId) throw new ErrInternalServer("missing flexiot device id")

  const {deletedCount} = await iotDeviceColl.deleteIotDeviceByFlexiotDeviceId(flexiotDeviceId, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (deletedCount === 0) throw new MdbNotDeleted("iotDevice");
}

async function deleteIotDeviceByUserId(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id")

  const {deletedCount} = await iotDeviceColl.deleteIotDeviceByUserId(userId, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (deletedCount === 0) throw new MdbNotDeleted("iotDevice");
}

async function getIotDeviceById(iotDeviceId, session) {
  let err;

  if (!iotDeviceId) throw new ErrInternalServer("missing iotDevice_id")

  const iotDeviceResult = await iotDeviceColl.getIotDeviceById(iotDeviceId, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (!iotDeviceResult) throw new MdbErrNotFound("iotDevice");

  return iotDeviceResult;
}

async function getIotDeviceUser(userId, iotDeviceId, session) {
  let err;

  if (!userId && !iotDeviceId) throw new ErrInternalServer("missing user_id or iotDevice_id")

  const iotDeviceResult = await iotDeviceColl.getIotDeviceByUserIdAndIotDeviceId(userId, iotDeviceId, session).catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (!iotDeviceResult) throw new MdbErrNotFound("iotDevice");

  return iotDeviceResult;
}

async function getAllIotDevice(session) {
  let err;

  const iotDeviceResults = await iotDeviceColl
    .getAllIotDevice(session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (!iotDeviceResults || iotDeviceResults.length === 0) throw new MdbErrNotFound("iotDevice");

  return iotDeviceResults;
}

async function getAllIotDeviceByDashboardId(dashboardId, session) {
  let err;

  const iotDeviceResults = await iotDeviceColl
    .getAllIotDeviceByDashboardId(dashboardId, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (!iotDeviceResults || iotDeviceResults.length === 0) return [];

  return iotDeviceResults;
}

async function getAllIotDeviceDataByDeviceLabel(deviceLabel, session) {
  let err;

  const iotDeviceResults = await iotDeviceColl
    .getAllIotDeviceByDeviceLabel(deviceLabel, session)
    .then(devices => devices.map(device => ({...device._doc, state: device.power > POWER_OFF_STATE})))
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;

  if (!iotDeviceResults || iotDeviceResults.length === 0) return [];

  return iotDeviceResults;
}

async function getAllIotDeviceByFlexiotDeviceIds(FlexiotDeviceIds, session) {
  let err;

  const iotDeviceResults = await iotDeviceColl
    .getAllIotDeviceByFlexiotDeviceIds(FlexiotDeviceIds, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;

  if (!iotDeviceResults || iotDeviceResults.length === 0) return [];

  return iotDeviceResults;
}

async function getAllIotDeviceByUserId(userId, session) {
  let err;

  const iotDeviceResults = await iotDeviceColl
    .getAllIotDeviceByUserId(userId, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (!iotDeviceResults || iotDeviceResults.length === 0) return [];

  return iotDeviceResults;
}

async function updateIotDeviceById(iotDeviceId, updatePayload, session) {
  let err;

  const updateIotDevice = await iotDeviceColl
    .updateIotDeviceById(iotDeviceId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (updateIotDevice?.matchedCount === 0) throw new MdbErrNotFound('iotDevice');
  if (updateIotDevice?.modifiedCount === 0) throw new MdbErrNotUpdated('iotDevice');
}

async function updateUpsertIotDeviceByMac(macAddress, updatePayload, session) {
  let err;

  const updateResult = await iotDeviceColl
    .updateUpsertIotDeviceByMac(macAddress, updatePayload, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;

  return updateResult;
}

async function updateIotDeviceByIdAndUserId(iotDeviceId, userId, updatePayload, session) {
  let err;

  const updateIotDevice = await iotDeviceColl
    .updateIotDeviceByIdAndUserId(iotDeviceId, userId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (updateIotDevice?.matchedCount === 0) throw new MdbErrNotFound('iotDevice');
  if (updateIotDevice?.modifiedCount === 0) throw new MdbErrNotUpdated('iotDevice');
}

async function updateIotDeviceByUserId(userId, updatePayload, session) {
  let err;

  const updateIotDevice = await iotDeviceColl
    .updateIotDeviceByUserId(userId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('iotDevice', e));
  if (err) throw err;
  if (updateIotDevice?.matchedCount === 0) throw new MdbErrNotFound('iotDevice');
  if (updateIotDevice?.modifiedCount === 0) throw new MdbErrNotUpdated('iotDevice');
}

module.exports = {
  createIotDevice,
  deleteIotDeviceById,
  deleteIotDeviceByFlexiotDeviceId,
  deleteIotDeviceByUserId,
  getIotDeviceById,
  getIotDeviceUser,
  getAllIotDevice,
  getAllIotDeviceByDashboardId,
  getAllIotDeviceDataByDeviceLabel,
  getAllIotDeviceByFlexiotDeviceIds,
  getAllIotDeviceByUserId,
  updateIotDeviceById,
  updateUpsertIotDeviceByMac,
  updateIotDeviceByIdAndUserId,
  updateIotDeviceByUserId
};
