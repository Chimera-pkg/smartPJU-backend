const {User} = require("../models/user.model");

async function getUserByEmail(email, session) {
  const query = User.findOne({email})
  return session ? query.session(session) : query;
}

async function getUserByFlexiotEmail(flexiotEmail, session) {
  const query = User.findOne({flexiot_email: flexiotEmail})
  return session ? query.session(session) : query;
}

async function getUserById(adminId, session) {
  const query = User.findOne({_id: adminId});
  return session ? query.session(session) : query;
}

async function getAllUser(session) {
  const query = User.find();
  return session ? query.session(session) : query;
}

async function createUser(payload, session) {
  const opt = session ? {session} : {};
  return User.create([payload], opt);
}

async function updateUserById(userId, updatePayload, session) {
  const query = User.updateOne({_id: userId}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function updateUserByEmail(email, updatePayload, session) {
  const query = User.updateOne({email}, {
    $set: updatePayload,
  });
  return session ? query.session(session) : query;
}

async function deleteUserById(userId, session) {
  const query = User.deleteOne({_id: userId});
  return session ? query.session(session) : query;
}

async function deleteUserByEmail(email, session) {
  const query = User.deleteOne({email});
  return session ? query.session(session) : query;
}

async function countUserByEmail(email, session) {
  const query = User.countDocuments({email})
  return session ? query.session(session) : query;
}


module.exports = {
  createUser,
  getUserById, getUserByEmail, getUserByFlexiotEmail, getAllUser,
  updateUserById, updateUserByEmail,
  deleteUserById, deleteUserByEmail,
  countUserByEmail
}
