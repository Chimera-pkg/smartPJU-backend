const {pickQuery} = require("../utils/request.util");
const {encryptPassword, decryptPassword} = require("../utils/crypto.util");
const {updateUserById, getUserById} = require("../services/user.service");
const {Response} = require("../utils/index");
const mongoose = require("mongoose");

async function UpdateUser(req, res, next) {
  const userId = req.headers['X-User-Id'];

  // validate request param
  const updatePayload = pickQuery(req.query, [
    "name",
    "flexiot_user_id",
    "flexiot_email",
    "flexiot_password",
    "flexiot_x_secret",
    "flexiot_mqtt_username",
    "flexiot_mqtt_password",
    "flexiot_mqtt_event_topic",
    "flexiot_mqtt_url",
  ]);

  if (updatePayload.flexiot_password === "") updatePayload.flexiot_password = undefined;
  if (updatePayload.flexiot_password)
    updatePayload.flexiot_password = encryptPassword(updatePayload.flexiot_password);

  let err;

  const session = await mongoose.startSession();
  await session.withTransaction(async (ctx) => {

    // update user
    await updateUserById(userId, updatePayload, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

  })
  await session.endSession()
  if (err) return next(err);

  Response(res, true, 200, "Successfully updated")
}

async function GetUser(req, res, next) {
  const userId = req.headers['X-User-Id'];
  let err;

  // update user
  const userData = await getUserById(userId).catch(e => err = e);
  if (err) return next(err);

  // modify data
  userData.password_hash = undefined
  userData.flexiot_x_secret = undefined
  userData.flexiot_email = undefined
  userData.flexiot_password_hash = undefined
  userData.flexiot_mqtt_username = undefined
  userData.flexiot_mqtt_password = undefined
  userData.flexiot_mqtt_event_topic = undefined
  userData.flexiot_mqtt_url = undefined

  Response(res, true, 200, "Got user", userData);
}

module.exports = {
  UpdateUser,
  GetUser
}
