const mongoose = require("mongoose");

const LetterSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  content: String,
  googleDriveId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Letter", LetterSchema);