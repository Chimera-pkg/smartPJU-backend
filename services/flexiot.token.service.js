const flexiotTokenColl = require("../collections/flexiot.token.coll");
const {MdbErrInternal, MdbNotDeleted} = require("../utils/errors/mongodb.error");
const {createFlexiotTokenScheme} = require("../validator/flexiot.token.validator");
const {ErrValidation} = require("../utils/errors/validation.error");
const {ErrInternalServer} = require("../utils/errors/api.error");


async function getFlexiotToken(flexiotEmail, session) {
  let err;

  // get flexiotToken
  const flexiotToken = await flexiotTokenColl
    .getFlexiotTokenByFlexiotEmail(flexiotEmail, session)
    .catch(e => err = new MdbErrInternal('flexiotToken', e));
  if (err) throw err;

  return flexiotToken;
}

async function getFlexiotHeadersByFlexiotUserId(flexiotUserId, session) {
  let err;

  // get flexiotToken
  const flexiotToken = await flexiotTokenColl
    .getFlexiotTokenByFlexiotUserId(flexiotUserId, session)
    .catch(e => err = new MdbErrInternal('flexiotToken', e));
  if (err) throw err;

  return {
    Authorization: flexiotToken.Authorization,
    "X-IoT-JWT": flexiotToken["X-IoT-JWT"]
  }
}

async function createFlexiotToken(payload, session) {
  let err;

  const validatedPayload = await createFlexiotTokenScheme.validate(payload).catch(e => err = new ErrValidation(e));

  // update flexiotToken
  await flexiotTokenColl
    .updateFlexiotTokenByFlexiotEmail(payload.flexiot_email, validatedPayload, session)
    .catch(e => err = new MdbErrInternal('flexiotToken', e));
  if (err) throw err;

  return validatedPayload;
}

async function deleteFlexiotToken(userEmail, session) {
  if (!userEmail) throw new ErrInternalServer("email is required");

  let err;

  const {deletedCount} = await flexiotTokenColl.deleteFlexiotTokenByEmail(userEmail, session)
    .catch(e => err = new MdbErrInternal('flexiotToken', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("flexiotToken");
}

module.exports = {
  getFlexiotToken,
  getFlexiotHeadersByFlexiotUserId,
  createFlexiotToken,
  deleteFlexiotToken,
};
