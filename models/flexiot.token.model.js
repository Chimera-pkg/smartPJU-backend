const mongoose = require("mongoose")

const flexiotTokenSchema = new mongoose.Schema({
  flexiot_email: {type: String, required: true, unique: true},
  Authorization: {type: String, required: true},
  "X-IoT-JWT": {type: String, required: true},
  updated_at: {type: Date, default: Date.now},
  created_at: {type: Date, default: Date.now}
});

module.exports = {
  FlexiotToken: mongoose.models.FlexiotToken || mongoose.model("FlexiotToken", flexiotTokenSchema, "flexiotToken")
}
