const mongoose = require("mongoose");

const ClassroomQuizzesSchema = new mongoose.Schema({
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
});

module.exports = mongoose.model("ClassroomQuizzes", ClassroomQuizzesSchema);
