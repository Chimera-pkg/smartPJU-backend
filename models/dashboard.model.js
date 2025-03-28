const mongoose = require("mongoose")

const dashboardSchema = new mongoose.Schema({
  user_id: {type: String, required: true, trim: true},
  name: {type: String, required: true, trim: true, unique: true},

  // configuration
  cost_per_kwh: {type: Number, required: true, default: 0},
  device_label: {type: String, required: true, trim: true, unique: true},

  updated_at: {type: Date, default: Date.now},
  created_at: {type: Date, default: Date.now},
});

module.exports = {
  Dashboard: mongoose.models.Dashboard || mongoose.model("Dashboard", dashboardSchema, "dashboard")
}
