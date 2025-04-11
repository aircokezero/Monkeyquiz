const express = require("express");
const router = express.Router();
const Classroom = require("../models/Classroom");
const StudentClass = require("../models/StudentClass");
const ClassroomQuizzes = require("../models/ClassQuiz");
const Profile = require("../models/Profiles");
const Quiz = require("../models/Quiz");
const StudSol = require("../models/StudSol");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;


router.get("/:classroomCode", async (req, res) => {
    try {
        const classroom = await Classroom.findOne({ _id: new ObjectId(req.params.classroomCode) });
        const username = await Profile.findOne({_id:new ObjectId(classroom.createdBy)},{username:1,_id:0});
        const name = username.username;
        if (!classroom) return res.status(404).json({ message: "Classroom not found" });
        const students = await StudentClass.find({ classroomId: req.params.classroomCode });
        const quizzes = await ClassroomQuizzes.find({ classroomId: classroom._id }).populate("quizId");
        res.json({ classroom,name, students, quizzes });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/uploadQuiz", async (req, res) => {
    const { classroomId, quizId } = req.body;
    try {
        const classroomQuiz = new ClassroomQuizzes({ classroomId, quizId });
        await classroomQuiz.save();
        res.json({ message: "Quiz uploaded successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/check", async (req,res) => {
    const { classroomId, quizId } = req.body;
    try {
        const quiz = await ClassroomQuizzes.findOne({classroomId: new ObjectId(classroomId),quizId: new ObjectId(quizId)});
        res.json({ exists: !!quiz });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/fetch",async(req,res)=>{
    const {classroomId}=req.body;
    try{
        const quizId = await ClassroomQuizzes.find({classroomId: new ObjectId(classroomId)});
        const quizIds = quizId.map(q => q.quizId);
        const quizdata = await Quiz.find({_id: { $in: quizIds } })
        res.status(200).json({ quizzes: quizdata });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/storeSol", async (req, res) => {
    try {
        const { userId,classroomId , username, topic, marks } = req.body;
        const formattedTopic = topic.trim().toLowerCase();
        let userQuiz = await StudSol.findOne({ 
            userId, 
            topic: formattedTopic, 
            classroomId: classroomId,
        });
        if (!userQuiz) {
            userQuiz = new StudSol({
                userId,
                classroomId,
                username,
                topic: formattedTopic,
                marks: [marks], 
            });
        } else {
            userQuiz.marks.push(marks);
        }
        await userQuiz.save();
        res.status(200).json({ 
            message: "Quiz result stored successfully!",
            data: userQuiz 
        });
    } catch (error) {
        console.error("Error storing quiz result:", error);
        res.status(500).json({ error: "Failed to store quiz result" });
    }
  });

  router.get("/studentsol/:classroomId", async (req, res) => {
    try {
        const { classroomId } = req.params;
        const solutions = await StudSol.find({ classroomId });
      res.json(solutions);
    } catch (error) {
      console.error("Error fetching student solutions:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
