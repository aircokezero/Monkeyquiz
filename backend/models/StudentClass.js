const mongoose = require("mongoose");

const StudentClassroomSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true }, // ✅ REQUIRED
});

const StudentClass = mongoose.model("StudentClass", StudentClassroomSchema);
module.exports = StudentClass;
