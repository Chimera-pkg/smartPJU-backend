const {Record} = require("../models/record.model");

async function getRecordById(recordId, session) {
  const query = Record.findOne({_id: recordId});
  return session ? query.session(session) : query;
}

async function getRecordsByFlexiotDeviceIds(flexiotDeviceIds = [], session) {
  const query = Record.find({flexiot_device_id: {$in: flexiotDeviceIds}});
  return session ? query.session(session) : query;
}

async function getRecordByUserId(userId, session) {
  const query = Record.findOne({user_id: userId});
  return session ? query.session(session) : query;
}

async function getAllRecordByDeviceLabelAndDate(deviceLabel, startDate, endDate, session) {
  const query = Record
    .find({
      device_label: deviceLabel,
      $and: [
        {datetime: {$gte: startDate}},
        {datetime: {$lte: endDate}},
      ]
    })
    .sort({datetime: 1});
  return session ? query.session(session) : query;
}

async function getAllRecord(session) {
  const query = Record.find();
  return session ? query.session(session) : query;
}

async function updateRecordById(recordId, updatePayload, session) {
  const query = Record.updateOne({_id: recordId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateRecordByUserId(userId, updatePayload, session) {
  const query = Record.updateOne({user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function createRecord(payload, session) {
  const opt = session ? {session} : {};
  return Record.create([payload], opt);
}

async function deleteRecordById(recordId, session) {
  const query = Record.deleteOne({_id: recordId});
  return session ? query.session(session) : query;
}

async function deleteRecordByUserId(userUd, session) {
  const query = Record.deleteOne({user_id: userUd});
  return session ? query.session(session) : query;
}

// // not yet well implemented
// async function bulkUpdateAndGetRecords(recordsQuery, session) {
//
//   // iterates through all records
//   const query = recordsQuery.map(qData => {
//     return {
//       updateOne: {
//         filter: {
//           flexiot_device_id: qData.flexiot_device_id,
//
//         },
//         update: {},
//       }
//     }
//   })
//   const bulkQuery = Record.bulkWrite([], {session});
// }

module.exports = {
  getRecordById,
  getRecordsByFlexiotDeviceIds,
  getRecordByUserId,
  getAllRecordByDeviceLabelAndDate,
  getAllRecord,
  createRecord,
  updateRecordById,
  updateRecordByUserId,
  deleteRecordById,
  deleteRecordByUserId,
}
