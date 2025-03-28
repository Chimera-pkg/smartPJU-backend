const {Dashboard} = require("../models/dashboard.model");

async function getDashboardById(dashboardId, session) {
  const query = Dashboard.findOne({_id: dashboardId});
  return session ? query.session(session) : query;
}

async function getDashboardByName(dashboardName, session) {
  const query = Dashboard.findOne({name: dashboardName});
  return session ? query.session(session) : query;
}

async function getDashboardByNameOrDeviceLabel(dashboardName, deviceLabel, session) {
  const query = Dashboard.findOne({
    $or: [
      {name: dashboardName},
      {device_label: deviceLabel}
    ]
  });
  return session ? query.session(session) : query;
}

async function getDashboardByUserId(userId, session) {
  const query = Dashboard.findOne({user_id: userId});
  return session ? query.session(session) : query;
}

async function getDashboardByUserIdAndDashboardId(userId, dashboardId, session) {
  const query = Dashboard.findOne({_id: dashboardId, user_id: userId});
  return session ? query.session(session) : query;
}

async function getAllDashboard(session) {
  const query = Dashboard.find();
  return session ? query.session(session) : query;
}

async function getAllDashboardByUserId(userId, session) {
  const query = Dashboard.find({user_id: userId});
  return session ? query.session(session) : query;
}

async function createDashboard(payload, session) {
  const opt = session ? {session} : {};
  return Dashboard.create([payload], opt);
}

async function updateDashboardById(dashboardId, updatePayload, session) {
  const query = Dashboard.updateOne({_id: dashboardId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateDashboardByIdAndUserId(dashboardId, userId, updatePayload, session) {
  const query = Dashboard.updateOne({_id: dashboardId, user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateDashboardByUserId(userId, updatePayload, session) {
  const query = Dashboard.updateOne({user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function deleteDashboardById(dashboardId, session) {
  const query = Dashboard.deleteOne({_id: dashboardId});
  return session ? query.session(session) : query;
}

async function deleteDashboardByUserId(userUd, session) {
  const query = Dashboard.deleteOne({user_id: userUd});
  return session ? query.session(session) : query;
}

module.exports = {
  getDashboardById,
  getDashboardByName,
  getDashboardByNameOrDeviceLabel,
  getDashboardByUserId,
  getDashboardByUserIdAndDashboardId,
  getAllDashboard,
  getAllDashboardByUserId,
  createDashboard,
  updateDashboardById,
  updateDashboardByIdAndUserId,
  updateDashboardByUserId,
  deleteDashboardById,
  deleteDashboardByUserId
}
