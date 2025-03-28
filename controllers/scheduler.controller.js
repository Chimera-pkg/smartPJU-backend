const {decryptPassword} = require("../utils/crypto.util");
const {getUserByFlexiotEmail} = require("../services/user.service");
const {Response} = require("../utils/index");
const {doFlexiotAuth} = require("../services/flexiot.service");
const {createFlexiotToken} = require("../services/flexiot.token.service");

async function FlexiotAuthByFlexiotEmail(req, res, next) {
  let err;

  const flexiotEmail = req.params?.flexiot_email;

  // get user data
  const userData = await getUserByFlexiotEmail(flexiotEmail).catch(e => err = e);
  if (err) return next(err)

  // decrypt flexiot password
  const flexiotPassword = decryptPassword(userData.flexiot_password_hash);
  if (err) return next(err)

  // do flexiot authentication
  const flexiotAuth = await doFlexiotAuth(userData.flexiot_x_secret, userData.flexiot_email, flexiotPassword)
    .catch(e => err = e);
  if (err) return next(err)

  // create payload
  const createFlexiotTokenPayload = {
    flexiot_email: flexiotEmail,
    Authorization: flexiotAuth.Authorization,
    "X-IoT-JWT": flexiotAuth["X-IoT-JWT"]
  };

  // save to db
  await createFlexiotToken(createFlexiotTokenPayload).catch(e => err = e);
  if (err) return next(err)

  Response(res, true, 200, "successful", createFlexiotTokenPayload);
}

module.exports = {
  FlexiotAuthByFlexiotEmail
}
