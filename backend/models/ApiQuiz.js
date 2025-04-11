const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    username: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true, enum: ["easy", "medium", "hard"] },
    marks: { type: [Number], default: [] } 
});

quizSchema.index({ userId: 1, topic: 1, difficulty: 1 }, { unique: true });

const Quiz = mongoose.model("ApiQuiz", quizSchema);
module.exports = Quiz;
