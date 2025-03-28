const {verifyAuthToken} = require("../utils/auth.util");
const {EBearerNotString, EBearerNotValid} = require("../utils/errors/authMiddleware.error");
const {getUserById} = require("../services/user.service");
const {ErrUnauthorized} = require("../utils/errors/api.error");

async function tokenValidator(req, res, next) {

  // check tokenValidator header
  let bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "string") return next(new EBearerNotString());

  // check bearer token
  bearerToken = bearerToken.split('Bearer');
  if (Array.isArray(bearerToken) && bearerToken.length !== 2) return next(new EBearerNotValid());

  // trim token
  bearerToken = bearerToken[1].trim();

  let err;

  // verify tokenValidator token
  const verifyResult = await verifyAuthToken(bearerToken).catch(e => err = e.message)
  if (err) return next(new EBearerNotValid(err));

  // get user
  const user = await getUserById(verifyResult.user_id).catch(e => err = e);
  if (err) return next(err)
  if (!user.is_active) return next(new ErrUnauthorized('user is not active'));

  // set validation headers
  req.headers["X-User-Id"] = user._id
  req.headers["X-User-Email"] = user.email
  req.headers["X-Flexiot-Email"] = user.flexiot_email
  req.headers["X-Flexiot-X-Secret"] = user.flexiot_x_secret

  next()
}

module.exports = {
  tokenValidator
}