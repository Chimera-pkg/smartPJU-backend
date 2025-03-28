const {Token} = require("../models/token.model");

async function createToken(payload, session) {
  const opt = session ? {session} : {};
  return Token.create([payload], opt);
}

async function getTokenByUserEmail(email, session) {
  const query = Token.findOne({email});
  return session ? query.session(session) : query;
}

async function getTokenByUserId(userId, session) {
  const query = Token.findOne({user_id: userId});
  return session ? query.session(session) : query;
}

async function getAllToken(session) {
  const query = Token.find();
  return session ? query.session(session) : query;
}

async function updateTokenByUserId(userId, updatePayload, session) {
  const query = Token.updateOne({user_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateTokenByUserEmail(email, updatePayload, session) {
  const query = Token.updateOne({email}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateUpsertTokenByUserEmail(email, payload, session) {
  const query = Token.updateOne({email}, payload, {upsert: true});
  return session ? query.session(session) : query;
}

async function deleteTokenByUserId(userId, session) {
  const query = Token.deleteOne({user_id: userId});
  return session ? query.session(session) : query;
}


async function deleteTokenByUserEmail(userEmail, session) {
  const query = Token.deleteOne({email: userEmail});
  return session ? query.session(session) : query;
}

module.exports = {
  createToken,
  getTokenByUserId, getTokenByUserEmail, getAllToken,
  updateTokenByUserId, updateTokenByUserEmail, updateUpsertTokenByUserEmail,
  deleteTokenByUserId, deleteTokenByUserEmail
}