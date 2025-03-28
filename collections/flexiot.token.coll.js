const {FlexiotToken} = require("../models/flexiot.token.model");

async function createFlexiotToken(payload, session) {
  const opt = session ? {session} : {};
  return FlexiotToken.create([payload], opt);
}

async function getFlexiotTokenByFlexiotEmail(email, session) {
  const query = FlexiotToken.findOne({email});
  return session ? query.session(session) : query;
}

async function getFlexiotTokenByFlexiotUserId(flexiotUserId, session) {
  const query = FlexiotToken.findOne({flexiot_user_id: flexiotUserId});
  return session ? query.session(session) : query;
}

async function getAllFlexiotToken(session) {
  const query = FlexiotToken.find();
  return session ? query.session(session) : query;
}


async function updateFlexiotTokenByFlexiotEmail(flexiotEmail, payload, session) {
  const query = FlexiotToken.updateOne({flexiot_email: flexiotEmail}, payload, {upsert: true});
  return session ? query.session(session) : query;
}

async function deleteFlexiotTokenByEmail(email, session) {
  const query = FlexiotToken.deleteOne({email});
  return session ? query.session(session) : query;
}

module.exports = {
  createFlexiotToken,
  getFlexiotTokenByFlexiotEmail,
  getFlexiotTokenByFlexiotUserId,
  getAllFlexiotToken,
  updateFlexiotTokenByFlexiotEmail,
  deleteFlexiotTokenByEmail,
}
