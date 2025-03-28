const mongoose = require("mongoose");
const {MdbErrNotValidObjectId} = require("./errors/mongodb.error");

async function mongoTx(cbFunction) {
  const session = await mongoose.startSession();
  await session.withTransaction(cbFunction)
  await session.endSession()
}

async function isValidObjectId(objectId, fieldName) {
  return new Promise((rs, rj) => mongoose.isValidObjectId(objectId) ?
    rs(objectId) : rj(new MdbErrNotValidObjectId(fieldName)))
}

// https://docs.mongodb.com/v5.0/core/transactions-in-applications/
async function commitWithRetry(session, maxRetries = 10) {
  let retry = 0;
  try {
    await session.commitTransaction();
    console.log('Transaction committed.');
  } catch (error) {
    const txErr = error.hasErrorLabel('UnknownTransactionCommitResult');

    if (txErr && retry <= maxRetries) {
      console.log('UnknownTransactionCommitResult, retrying commit operation ...');
      return await commitWithRetry(session);
    }

    console.log('Error during commit ...');
    throw error;

  }
}


// https://developpaper.com/learning-records-of-mongodb-master-class-day-18/
// https://docs.mongodb.com/manual/reference/read-concern-snapshot/
const txConfig = {
  readConcern: {level: 'snapshot'},
  writeConcern: {w: 'majority'},
  readPreference: 'primary',
  maxCommitTimeMS: 2000
}

module.exports = {mongoTx, isValidObjectId, commitWithRetry, txConfig}
