const tokenColl = require("../collections/token.coll");
const {MdbErrInternal, MdbNotDeleted} = require("../utils/errors/mongodb.error");
const {generateAuthToken, verifyAuthToken} = require("../utils/auth.util");
const {createTokenScheme} = require("../validator/token.validator");
const {ErrValidation} = require("../utils/errors/validation.error");
const {ErrInternalServer, ErrUnauthorized} = require("../utils/errors/api.error");
const {getUserById} = require("./user.service");
const {ErrInvalidSession} = require("../utils/errors/token.error");


async function createToken(payload, session) {
  let err;

  const validatedPayload = await createTokenScheme.validate(payload).catch(e => err = new ErrValidation(e));

  // remove created_at and updated_at from validatedPayload
  const generateTokenPayload = {...validatedPayload, created_at: undefined, updated_at: undefined};

  // generate jwt access token and refresh token
  const accessToken = generateAuthToken(generateTokenPayload)
  const refreshToken = generateAuthToken(generateTokenPayload, "4w")

  // create token payload
  const createTokenPayload = {...payload, refresh_token: refreshToken};

  // update token
  await tokenColl
    .updateUpsertTokenByUserEmail(payload.email, createTokenPayload, session)
    .catch(e => err = new MdbErrInternal('token', e));
  if (err) throw err;

  return {...createTokenPayload, access_token: accessToken};
}

async function deleteToken(userEmail, session) {
  if (!userEmail) throw new ErrInternalServer("email is required");

  let err;

  const {deletedCount} = await tokenColl.deleteTokenByUserEmail(userEmail, session)
    .catch(e => err = new MdbErrInternal('token', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("token");
}

async function verifyRefreshToken(refreshTokenPayload, session) {
  let err;

  // verify refresh token
  const verifiedToken = await verifyAuthToken(refreshTokenPayload).catch(e => err = new ErrUnauthorized(e.message));
  if (err) throw err;

  // get token by user_id and role_type
  const getToken = await tokenColl.getTokenByUserId(verifiedToken.user_id, session).catch(e => err = new MdbErrInternal(e));
  if (err) throw err;
  if (!getToken) throw new ErrInvalidSession("refresh token reference is not found");

  // match refresh_token
  if (refreshTokenPayload !== getToken.refresh_token) throw new ErrUnauthorized("invalid refresh token");

  // check if user is active
  const userData = await getUserById(verifiedToken.user_id, session).catch(e => err = e);
  if (err) throw err;
  if (!userData.is_active) throw new ErrUnauthorized("user is not active");

  return verifiedToken;
}


module.exports = {
  createToken,
  deleteToken,
  verifyRefreshToken
};
