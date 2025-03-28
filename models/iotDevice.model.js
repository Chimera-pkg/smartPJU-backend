const mongoose = require("mongoose")

const iotDeviceSchema = new mongoose.Schema({
  flexiot_device_id: {type: Number, required: true},
  device_definition_id: {type: Number, required: true},
  zone_id: {type: String, required: true},

  name: {type: String, required: true},
  mac: {type: String, required: true},
  device_label: {type: String, required: true},
  timestamp: {type: String, required: true},

  kwh: {type: Number, required: true},
  power: {type: Number, required: true},
  current: {type: Number, required: true},
  voltage: {type: Number, required: true},

  is_timer_mode: {type: String, required: true},
  timer_started_at: {type: String, required: true},
  timer_ended_at: {type: String, required: true},
  dimmer_value: {type: String, required: true},
  lamp_status: {type: String, required: true},
  longitude: {type: String, required: true},
  latitude: {type: String, required: true},

  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
});

module.exports = {
  IotDevice: mongoose.models.IotDevice || mongoose.model("IotDevice", iotDeviceSchema, "iotDevice")
}
