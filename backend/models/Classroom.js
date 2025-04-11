const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  createdBy: mongoose.Schema.Types.ObjectId, 
});
const Classroom = mongoose.model("Classroom", ClassroomSchema);
module.exports = Classroom