const recordColl = require("../collections/record.coll");
const {
  MdbErrInternal,
  MdbNotDeleted,
  MdbErrNotFound,
  MdbErrNotUpdated
} = require("../utils/errors/mongodb.error");
const {ErrInternalServer} = require("../utils/errors/api.error");
const {ErrValidation} = require("../utils/errors/validation.error");
const {createRecordScheme} = require("../validator/record.validator");

async function createRecord(payload, session) {
  let err;

  // validate payload
  const validatedPayload = await createRecordScheme.validate(payload).catch(e => err = new ErrValidation(e));
  if (err) throw err;

  // create record
  const createRecordResult = await recordColl
    .createRecord(validatedPayload, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;

  return createRecordResult;
}

async function deleteRecordById(recordId, session) {
  let err;

  if (!recordId) throw new ErrInternalServer("missing record_id")

  const {deletedCount} = await recordColl.deleteRecordById(recordId, session).catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("record");
}

async function deleteRecordByUserId(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id");

  const {deletedCount} = await recordColl
    .deleteRecordByUserId(userId, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("record");
}

async function getRecordById(recordId, session) {
  let err;

  if (!recordId) throw new ErrInternalServer("missing record_id");

  const recordResult = await recordColl
    .getRecordById(recordId, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (!recordResult) throw new MdbErrNotFound("record");

  return recordResult;
}

async function getRecordByUserId(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id")

  const recordResult = await recordColl
    .getRecordByUserId(userId, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (!recordResult) throw new MdbErrNotFound("record");

  return recordResult;
}

async function getAllRecord(session) {
  let err;

  const recordResults = await recordColl
    .getAllRecord(session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (!recordResults || recordResults.length === 0) throw new MdbErrNotFound("record");

  return recordResults;
}

async function getAllRecordByDeviceLabelAndDate(deviceLabel, dateMonth, session) {
  let err;
  const dObj = new Date(dateMonth);

  let startDate = new Date(dObj.getFullYear(), dObj.getMonth(), 1);
  let endDate = new Date(dObj.getFullYear(), dObj.getMonth() + 1, 0);

  startDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
  endDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`

  const recordResults = await recordColl
    .getAllRecordByDeviceLabelAndDate(deviceLabel, startDate, endDate, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (!recordResults || recordResults.length === 0) return []

  return recordResults;
}

async function getAllRecordsFlexiotDeviceIds(flexiotDeviceIds = [], session) {
  let err;

  const recordResults = await recordColl
    .getRecordsByFlexiotDeviceIds(flexiotDeviceIds, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (!recordResults || recordResults?.length === 0) return [];

  return recordResults;
}

async function updateRecordById(recordId, updatePayload, session) {
  let err;

  const updateRecord = await recordColl
    .updateRecordById(recordId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (updateRecord?.matchedCount === 0) throw new MdbErrNotFound('record');
  if (updateRecord?.modifiedCount === 0) throw new MdbErrNotUpdated('record');
}

async function updateRecordByUserId(userId, updatePayload, session) {
  let err;

  const updateRecord = await recordColl
    .updateRecordByUserId(userId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('record', e));
  if (err) throw err;
  if (updateRecord?.matchedCount === 0) throw new MdbErrNotFound('record');
  if (updateRecord?.modifiedCount === 0) throw new MdbErrNotUpdated('record');
}

module.exports = {
  createRecord,
  deleteRecordById, deleteRecordByUserId,
  getRecordById, getRecordByUserId, getAllRecord, getAllRecordByDeviceLabelAndDate, getAllRecordsFlexiotDeviceIds,
  updateRecordById, updateRecordByUserId
};
