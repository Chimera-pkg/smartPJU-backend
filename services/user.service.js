const userColl = require("../collections/user.coll");
const {
  MdbErrInternal,
  MdbExists,
  MdbNotDeleted,
  MdbErrNotFound,
  MdbErrNotUpdated
} = require("../utils/errors/mongodb.error");
const {hashPassword} = require("../utils/auth.util");
const {ErrInternalServer} = require("../utils/errors/api.error");
const {ErrHashPassword} = require("../utils/errors/hash.error");
const {encryptPassword} = require("../utils/crypto.util");


async function createUser(payload, session) {
  let err;

  if (!payload) throw new ErrInternalServer("missing payload")

  // check user by email
  const userData = await userColl.getUserByEmail(payload.email, session).catch(e => err = new MdbErrInternal('user', e));
  if (userData) throw new MdbExists('user');
  if (err) throw err;

  // generate hash password
  const hashedPassword = await hashPassword(payload.password).catch(e => err = new ErrHashPassword(e));
  if (err) throw err;

  // encrypt flexiot password
  const encryptedPassword = encryptPassword(payload.flexiot_password);

  // create user
  const createUserPayload = {...payload, password_hash: hashedPassword, flexiot_password_hash: encryptedPassword};
  const createUserResult = await userColl.createUser(createUserPayload, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;

  return {...payload, password_hash: hashedPassword, _id: createUserResult[0]._id};
}

async function deleteUserById(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id")

  const {deletedCount} = await userColl.deleteUserById(userId, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("user");
}

async function deleteUserByEmail(userEmail, session) {
  let err;

  if (!userEmail) throw new ErrInternalServer("missing email")

  const {deletedCount} = await userColl.deleteUserByEmail(userEmail, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (deletedCount === 0) throw new MdbNotDeleted("user");
}

async function getUserById(userId, session) {
  let err;

  if (!userId) throw new ErrInternalServer("missing user_id")

  const userResult = await userColl.getUserById(userId, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (!userResult) throw new MdbErrNotFound("user");

  return userResult;
}

async function getUserByEmail(email, session) {
  let err;

  if (!email) throw new ErrInternalServer("missing email")

  const userResult = await userColl.getUserByEmail(email, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (!userResult) throw new MdbErrNotFound("user");

  return userResult;
}

async function getUserByFlexiotEmail(flexiotEmail, session) {
  let err;

  if (!flexiotEmail) throw new ErrInternalServer("missing flexiot email")

  const userResult = await userColl.getUserByFlexiotEmail(flexiotEmail, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (!userResult) throw new MdbErrNotFound("user");

  return userResult;
}

async function getAllUser(session) {
  let err;

  const userResults = await userColl.getAllUser(session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (!userResults || userResults.length === 0) throw new MdbErrNotFound("user");

  return userResults;
}

async function updateUserById(userId, updatePayload, session) {
  let err;

  const updateUser = await userColl.updateUserById(userId, updatePayload, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (updateUser?.matchedCount === 0) throw new MdbErrNotFound('user');
  if (updateUser?.modifiedCount === 0) throw new MdbErrNotUpdated('user');
}

async function updateUserByEmail(userEmail, updatePayload, session) {
  let err;

  const updateUser = await userColl.updateUserByEmail(userEmail, updatePayload, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  if (updateUser?.matchedCount === 0) throw new MdbErrNotFound('user');
  if (updateUser?.modifiedCount === 0) throw new MdbErrNotUpdated('user');
}

async function userExistsByEmail(email, session) {
  let err;

  if (!email) throw new ErrInternalServer("missing email")

  const countUser = await userColl.countUserByEmail(email, session).catch(e => err = new MdbErrInternal('user', e));
  if (err) throw err;
  return countUser > 0;
}


module.exports = {
  createUser,
  deleteUserById, deleteUserByEmail,
  getUserById, getUserByEmail, getUserByFlexiotEmail, getAllUser,
  updateUserById, updateUserByEmail,
  userExistsByEmail
};
