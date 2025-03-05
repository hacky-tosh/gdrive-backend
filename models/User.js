const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  profilePicture: String,
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: false },
});

module.exports = mongoose.model("User", UserSchema);