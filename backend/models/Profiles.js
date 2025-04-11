const mongoose = require("mongoose");

const profiles = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
});

module.exports = mongoose.model("profiles", profiles);
