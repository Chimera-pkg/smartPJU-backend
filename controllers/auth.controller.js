const {loginUserScheme} = require("../validator/auth.validator");
const {Response} = require("../utils/index");
const {ErrValidation} = require("../utils/errors/validation.error");
const userService = require("../services/user.service");
const tokenService = require("../services/token.service");
const {mongoTx} = require("../utils/mongo.util");
const {ErrService} = require("../utils/errors");
const {comparePassword} = require("../utils/auth.util");
const {ErrIncorrectPassword, ErrUserNotFound, ErrUserExists} = require("../utils/errors/user.error");
const {ErrInvalidSession} = require("../utils/errors/token.error");
const {MdbNotDeleted, MdbErrNotFound} = require("../utils/errors/mongodb.error");
const {encryptPassword} = require("../utils/crypto.util");
const {createUserScheme} = require("../validator/user.validator");
const {
  DEFAULT_FLEXIOT_X_SECRET,
  DEFAULT_FLEXIOT_EMAIL,
  DEFAULT_FLEXIOT_PASSWORD,
  DEFAULT_FLEXIOT_USER_ID,
  DEFAULT_FLEXIOT_MQTT_USERNAME,
  DEFAULT_FLEXIOT_MQTT_PASSWORD,
  DEFAULT_FLEXIOT_MQTT_EVENT_TOPIC,
  DEFAULT_FLEXIOT_MQTT_URL,
} = require("../configs/default.config");

async function Register(req, res, next) {
  let err;

  let validatedPayload;

  // check if user gives flexiot account
  if (
    !req.body.flexiot_email &&
    !req.body.flexiot_password &&
    !req.body.flexiot_retype_password &&
    !req.body.flexiot_x_secret &&
    !req.body.flexiot_user_id &&
    !req.body.flexiot_mqtt_username &&
    !req.body.flexiot_mqtt_password &&
    !req.body.flexiot_mqtt_event_topic &&
    !req.body.flexiot_mqtt_url
  ) {
    // append default flexiot account
    req.body.flexiot_email = DEFAULT_FLEXIOT_EMAIL
    req.body.flexiot_password = DEFAULT_FLEXIOT_PASSWORD
    req.body.flexiot_retype_password = DEFAULT_FLEXIOT_PASSWORD
    req.body.flexiot_x_secret = DEFAULT_FLEXIOT_X_SECRET
    req.body.flexiot_user_id = DEFAULT_FLEXIOT_USER_ID
    req.body.flexiot_mqtt_username = DEFAULT_FLEXIOT_MQTT_USERNAME
    req.body.flexiot_mqtt_password = DEFAULT_FLEXIOT_MQTT_PASSWORD
    req.body.flexiot_mqtt_event_topic = DEFAULT_FLEXIOT_MQTT_EVENT_TOPIC
    req.body.flexiot_mqtt_url = DEFAULT_FLEXIOT_MQTT_URL
  }
  validatedPayload = await createUserScheme.validate(req.body).catch(e => err = new ErrValidation(e));
  if (err) return next(err);

  let createTokenResult;

  // start mongo transaction
  await mongoTx(async (ctx) => {

    // check existing user
    await userService.userExistsByEmail(validatedPayload.email, ctx)
      .then(d => d ? err = new ErrUserExists() : '')
      .catch(e => err = new ErrService('user', e));
    if (err) return ctx.abortTransaction();

    // encrypt flexiot password
    validatedPayload.flexiot_password = encryptPassword(validatedPayload.flexiot_password);

    // do create user
    const userData = await userService.createUser(validatedPayload, ctx).catch(e => err = new ErrService('user', e));
    if (err) return ctx.abortTransaction();

    // create jwt token
    const createTokenPayload = {
      email: userData.email,
      user_id: userData._id
    }
    createTokenResult = await tokenService.createToken(createTokenPayload, ctx).catch(e => err = new ErrService('token', e));
    if (err) return ctx.abortTransaction();

  })
  if (err) return next(err);

  Response(res, true, 200, "Account successfully created", createTokenResult);
}

async function Login(req, res, next) {
  let err;

  // validate request body
  const validatedPayload = await loginUserScheme.validate(req.body).catch(e => err = new ErrValidation(e))
  if (err) return next(err);

  let createTokenResult;

  // start mongo transaction
  await mongoTx(async (ctx) => {

    // check existing user
    const userData = await userService.getUserByEmail(validatedPayload.email, ctx).catch(e => err = e);
    if (err instanceof MdbErrNotFound) err = new ErrUserNotFound();
    if (err) return ctx.abortTransaction();

    // check password
    const isValidPassword = await comparePassword(validatedPayload.password, userData.password_hash)
      .catch(e => err = new ErrService('user', e))
    if (err) return ctx.abortTransaction();

    if (!isValidPassword) {
      err = new ErrIncorrectPassword();
      return ctx.abortTransaction();
    }

    // create jwt token
    const createTokenPayload = {
      email: userData.email,
      user_id: userData._id
    }
    createTokenResult = await tokenService.createToken(createTokenPayload, ctx).catch(e => err = new ErrService('token', e));
    if (err) return ctx.abortTransaction();
  })

  if (err) return next(err);

  Response(res, true, 200, "Account successfully logged in", createTokenResult);
}

async function Logout(req, res, next) {
  const userEmail = req.headers["X-User-Email"];

  let err

  // start mongo transaction
  await mongoTx(async (ctx) => {

    await tokenService.deleteToken(userEmail, ctx).catch(e => err = e);
    if (err instanceof MdbNotDeleted) err = new ErrInvalidSession();
    if (err) return ctx.abortTransaction();

  })

  if (err) return next(err);

  Response(res, true, 200, "Account successfully logged out");
}

async function RefreshToken(req, res, next) {

  let err

  // refresh token param
  const refreshTokenParam = req.params["refresh_token"];

  let createTokenResult;

  // start mongo transaction
  await mongoTx(async (ctx) => {

    // verify refresh token
    const verifiedToken = await tokenService
      .verifyRefreshToken(refreshTokenParam, ctx)
      .catch(e => err = new ErrService('token', e));
    if (err) return ctx.abortTransaction();

    // get user by user id
    const userData = await userService.getUserById(verifiedToken.user_id, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

    // create jwt token
    const createTokenPayload = {
      email: userData.email,
      user_id: userData._id
    }

    // create new token
    createTokenResult = await tokenService.createToken(createTokenPayload, ctx).catch(e => err = e);
    if (err) return ctx.abortTransaction();

  })
  if (err) return next(err);

  Response(res, true, 200, "Successfully refreshed token", createTokenResult);
}

module.exports = {
  Register,
  Login,
  Logout,
  RefreshToken
}
