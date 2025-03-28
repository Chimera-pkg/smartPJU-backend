const mongoose = require("mongoose");
require('dotenv').config();

async function ConnectDB(timeoutMS) {
  if (mongoose.connection.readyState === 1) return

  return mongoose.connect(process.env.MONGODB_URI, {
    authMechanism: "SCRAM-SHA-1",
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    keepAlive: true,
    connectTimeoutMS: timeoutMS,
    serverSelectionTimeoutMS: timeoutMS,
  })
}

module.exports = {
  ConnectDB
}