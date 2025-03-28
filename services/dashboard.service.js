const dashboardColl = require("../collections/dashboard.coll");
const {
  MdbErrInternal,
  MdbExists,
  MdbNotDeleted,
  MdbErrNotFound,
  MdbErrNotUpdated
} = require("../utils/errors/mongodb.error");
const {ErrInternalServer} = require("../utils/errors/api.error");

async function createDashboard(payload, session) {
  let err;

  if (!payload) throw new ErrInternalServer("missing payload")

  // check dashboard by name
  const dashboardData = await dashboardColl
    .getDashboardByNameOrDeviceLabel(payload.name, payload.device_label, session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (dashboardData) throw new MdbExists('dashboard');

  // create dashboard
  const createResult = await dashboardColl.createDashboard(payload, session).catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;

  return createResult;
}

async function deleteDashboardById(dashboardId, session) {
  let err;

  if (!dashboardId) throw new ErrInternalServer("missing dashboard_id")

  const {deletedCount} = await dashboardColl.deleteDashboardById(dashboardId, session).catch(e => err = new MdbErrInternal('dashboard', e));
  if (deletedCount === 0) throw new MdbNotDeleted("dashboard");
}

async function deleteDashboardByUserId(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id")

  const {deletedCount} = await dashboardColl.deleteDashboardByUserId(userId, session).catch(e => err = new MdbErrInternal('dashboard', e));
  if (deletedCount === 0) throw new MdbNotDeleted("dashboard");
}

async function getDashboardById(dashboardId, session) {
  let err;

  if (!dashboardId) throw new ErrInternalServer("missing dashboard_id")

  const dashboardResult = await dashboardColl.getDashboardById(dashboardId, session).catch(e => err = new MdbErrInternal('dashboard', e));
  if (!dashboardResult) throw new MdbErrNotFound("dashboard");

  return dashboardResult;
}

async function getDashboardUser(userId, dashboardId, session) {
  let err;

  if (!userId && !dashboardId) throw new ErrInternalServer("missing user_id or dashboard_id")

  const dashboardResult = await dashboardColl.getDashboardByUserIdAndDashboardId(userId, dashboardId, session).catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (!dashboardResult) throw new MdbErrNotFound("dashboard");

  return dashboardResult;
}

async function getAllDashboard(session) {
  let err;

  const dashboardResults = await dashboardColl
    .getAllDashboard(session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (!dashboardResults || dashboardResults.length === 0) throw new MdbErrNotFound("dashboard");

  return dashboardResults;
}

async function getAllDashboardByUserId(userId, session) {
  let err;

  const dashboardResults = await dashboardColl
    .getAllDashboardByUserId(userId, session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (!dashboardResults || dashboardResults.length === 0) return [];

  return dashboardResults;
}

async function updateDashboardById(dashboardId, updatePayload, session) {
  let err;

  const updateDashboard = await dashboardColl
    .updateDashboardById(dashboardId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (updateDashboard?.matchedCount === 0) throw new MdbErrNotFound('dashboard');
  if (updateDashboard?.modifiedCount === 0) throw new MdbErrNotUpdated('dashboard');
}

async function updateDashboardByIdAndUserId(dashboardId, userId, updatePayload, session) {
  let err;

  const updateDashboard = await dashboardColl
    .updateDashboardByIdAndUserId(dashboardId, userId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (updateDashboard?.matchedCount === 0) throw new MdbErrNotFound('dashboard');
  // if (updateDashboard?.modifiedCount === 0) throw new MdbErrNotUpdated('dashboard');
}

async function updateDashboardByUserId(userId, updatePayload, session) {
  let err;

  const updateDashboard = await dashboardColl
    .updateDashboardByUserId(userId, updatePayload, session)
    .catch(e => err = new MdbErrInternal('dashboard', e));
  if (err) throw err;
  if (updateDashboard?.matchedCount === 0) throw new MdbErrNotFound('dashboard');
  if (updateDashboard?.modifiedCount === 0) throw new MdbErrNotUpdated('dashboard');
}

module.exports = {
  createDashboard,
  deleteDashboardById,
  deleteDashboardByUserId,
  getDashboardById,
  getDashboardUser,
  getAllDashboard,
  getAllDashboardByUserId,
  updateDashboardById,
  updateDashboardByIdAndUserId,
  updateDashboardByUserId
};
