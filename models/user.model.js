const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, lowercase: true, trim: true, unique: true},
  password_hash: {type: String, required: true, trim: true},
  flexiot_user_id: {type: Number, required: true, trim: true},
  flexiot_email: {type: String, required: true, lowercase: true, trim: true},
  flexiot_password_hash: {type: String, required: true, trim: true},
  flexiot_x_secret: {type: String, required: true, trim: true},

  flexiot_mqtt_username: {type: String, required: true, trim: true},
  flexiot_mqtt_password: {type: String, required: true, trim: true},
  flexiot_mqtt_event_topic: {type: String, required: true, trim: true},
  flexiot_mqtt_url: {type: String, required: true, trim: true},

  is_active: {type: Boolean, default: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});

module.exports = {
  User: mongoose.models.User || mongoose.model("User", userSchema, "user")
}
