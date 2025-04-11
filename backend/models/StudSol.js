const mongoose = require("mongoose");

const solquizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    classroomId:{type: mongoose.Schema.Types.ObjectId, required: true},
    username: { type: String, required: true },
    topic: { type: String, required: true },
    marks: { type: [Number], default: [] } 
});

solquizSchema.index({ userId: 1, topic: 1}, { unique: true });
const StudSol = mongoose.model("StudSol", solquizSchema);
module.exports = StudSol;
