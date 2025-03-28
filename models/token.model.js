const mongoose = require("mongoose")

const tokenSchema = new mongoose.Schema({
  user_id: {type: String, required: true},
  email: {type: String, required: true},
  refresh_token: {type: String, required: true},
  created_at: {type: Date, default: Date.now}
});

module.exports = {
  Token: mongoose.models.Token || mongoose.model("Token", tokenSchema, "token")
}