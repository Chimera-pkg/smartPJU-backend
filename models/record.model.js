const mongoose = require("mongoose")

const recordSchema = new mongoose.Schema({
  device_label: {type: String, required: true},
  kwh: {type: Number, required: true},
  mac: {type: String, required: true},
  datetime: {type: String, required: true},

  created_at: {type: Date, default: Date.now},
});

module.exports = {
  Record: mongoose.models.Record || mongoose.model("Record", recordSchema, "record")
}
