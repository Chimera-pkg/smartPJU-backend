const {pickQuery} = require("../utils/request.util");
const {
  createDashboard,
  updateDashboardByIdAndUserId,
} = require("../services/dashboard.service");
const {Response} = require("../utils/index");
const mongoose = require("mongoose");
const {getAllDashboardByUserId} = require("../services/dashboard.service");
const {createDashboardScheme} = require("../validator/dashboard.validator");
const {ErrValidation, ErrAxios} = require("../utils/errors/validation.error");
const {mongoTx} = require("../utils/mongo.util");
const {getFlexiotDevices, flexiotLogin} = require("../services/flexiot.service");
const {ErrInternalServer} = require("../utils/errors/api.error");
const _ = require('lodash');
const {MdbErrNotUpdated} = require("../utils/errors/mongodb.error");
const {
  getAllIotDeviceDataByDeviceLabel,
} = require("../services/iotDevice.service");
const {deleteIotDeviceByFlexiotDeviceId} = require("../services/iotDevice.service");
const {Api} = require("../utils/httpReq.util");

async function UpdateDashboardByIdAndUserId(req, res, next) {
  const userId = req.headers['X-User-Id'];

  // validate request path param
  const dashboardId = req.params?.dashboard_id
  console.assert(dashboardId, "dashboard_id is required");

  // validate request query param
  const updatePayload = pickQuery(req.query, [
    "name",
    "cost_per_kwh",
    "event_name",
    "device_label"
  ]);

  let err;

  const session = await mongoose.startSession();
  await session.withTransaction(async (ctx) => {

    // update dashboard
    await updateDashboardByIdAndUserId(dashboardId, userId, updatePayload, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

  })
  await session.endSession()
  if (err) return next(err);

  Response(res, true, 200, "Successfully updated")
}

async function CreateDashboard(req, res, next) {
  const userId = req.headers['X-User-Id'];

  let err;

  // validate request body
  const validatedPayload = await createDashboardScheme.validate(req.body).catch(e => err = new ErrValidation(e))
  if (err) return next(err);

  const session = await mongoose.startSession();
  await session.withTransaction(async (ctx) => {

    // create dashboard payload
    validatedPayload.user_id = userId;

    // create dashboard
    await createDashboard(validatedPayload, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

  })
  await session.endSession()
  if (err) return next(err);

  Response(res, true, 200, "Successfully create dashboard")
}

async function GetAllDashboardByUserId(req, res, next) {
  const userId = req.headers['X-User-Id'];
  let err;

  // get all dashboard
  const dashboardData = await getAllDashboardByUserId(userId).catch(e => err = e);
  if (err) return next(err);

  Response(res, true, 200, `Got ${dashboardData?.length} dashboard`, dashboardData);
}

async function SyncDashboard(req, res, next) {
  const userId = req.headers['X-User-Id'];

  let err;

  // validate request path param
  const deviceLabel = req.params.device_label

  // start mongo transaction
  await mongoTx(async (ctx) => {

    // do flexiot login
    const doFlexiotLogin = await flexiotLogin(userId, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

    const [userData, headers] = doFlexiotLogin;

    // get all devices from dashboard
    const dashboardDevicesIds = await getAllIotDeviceDataByDeviceLabel(deviceLabel)
      .then(devices => devices.map(device => device.flexiot_device_id))
      .catch(e => err = e);
    if (err) return next(err);

    // get all flexiot device
    const flexiotDevices = await getFlexiotDevices(headers).catch(e => err = e);
    if (err) return ctx.abortTransaction();

    // filter device that contain device_label
    const filteredFlexiotDevices = flexiotDevices
      .filter(device => device.name.includes(deviceLabel))
      .map(device => device.id);

    // compare flexiot_devices in dashboard with filtered flexiot devices
    const deletedIds = _.pullAll(dashboardDevicesIds, filteredFlexiotDevices);

    for (const ids of deletedIds) {
      await deleteIotDeviceByFlexiotDeviceId(ids, ctx).catch(e => err = e);
      if (err) return ctx.abortTransaction();
    }

  }).catch(e => err = new ErrInternalServer(e.stack))

  if (err instanceof MdbErrNotUpdated) return Response(res, true, 200, "Already synced")

  await Api.put("/device/realtimeupdate").catch(e => err = new ErrAxios(e))

  if (err) return next(err);
  Response(res, true, 200, "Successfully syncing dashboard")
}

module.exports = {
  UpdateDashboardByIdAndUserId,
  CreateDashboard,
  GetAllDashboardByUserId,
  SyncDashboard,
}
