const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const QuizResult = require("../models/ApiQuiz");

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

router.post("/quizzes", async (req, res) => {
  try {
    const { teacherId, title, difficulty, timeLimit, questions } = req.body;
    if (!teacherId || !title || !difficulty || !timeLimit || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Missing or invalid fields" });
    }
    const newQuiz = new Quiz({ teacherId, title, difficulty, timeLimit, questions });
    await newQuiz.save();
    res.status(201).json({ message: "Quiz saved successfully!", quiz: newQuiz });
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/createdquizzes", async (req, res) => {
    const { teacherId } = req.query;
    if (!teacherId) {
      return res.status(400).json({ error: "Missing teacherId parameter" });
    }
    try { 
      const quizzes = await Quiz.find({ teacherId: new ObjectId(teacherId) });
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.get("/quizzes/:quizId",async(req,res)=>{
  try{
  const quiz = await Quiz.findById(req.params.quizId);
  res.json(quiz);
  }
  catch(error){
    console.error("Error fetching quiz:", error);
  }
})
router.put("/quizzes/:quizId", async (req, res) => {
  const { quizId } = req.params;
  const { title, difficulty, timeLimit, questions, teacherId } = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizId,
      {
        title,
        difficulty,
        timeLimit,
        questions,
        teacherId,
      },
      { new: true } 
    );
    res.json({ message: "Quiz updated successfully", quiz: updatedQuiz });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

  router.get("/quiz/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      if (!quizId) {
        return res.status(400).json({ error: "Quiz ID is required" });
      }
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Server error" });
    }
  });


  router.post("/store", async (req, res) => {
    console.log("Received request at /store:", req.body);
    try {
        const { userId, username, topic, difficulty, marks } = req.body;
        const formattedTopic = topic.trim().toLowerCase();
        const formattedDifficulty = difficulty.trim().toLowerCase();
        let userQuiz = await QuizResult.findOne({ 
            userId, 
            topic: formattedTopic, 
            difficulty: formattedDifficulty 
        });
        
        if (!userQuiz) {
            userQuiz = new QuizResult({
                userId,
                username,
                topic: formattedTopic,
                difficulty: formattedDifficulty,
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
  
router.get('/user/:userId', async (req, res) => {
  try {
    const quizzes = await QuizResult.find({ userId: req.params.userId });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
  
router.get('/leaderboard', async (req, res) => {
  try {
    const quizzes = await QuizResult.find();
    const userStats = {};

    quizzes.forEach(quiz => {
      const userId = quiz.userId.toString();
      const username = quiz.username;
      const rawMarks = quiz?.marks;

      const totalMarks = Array.isArray(rawMarks)
        ? rawMarks.reduce((a, b) => a + b, 0)
        : (typeof rawMarks === "number" ? rawMarks : 0);

      const attempts = Array.isArray(rawMarks)
        ? rawMarks.length
        : (typeof rawMarks === "number" ? 1 : 0);

      if (!userStats[userId]) {
        userStats[userId] = {
          username,
          totalScore: 0,
          totalAttempts: 0
        };
      }
      userStats[userId].totalScore += totalMarks;
      userStats[userId].totalAttempts += attempts;
    });

    const leaderboard = Object.entries(userStats)
      .map(([userId, data]) => ({
        userId,
        ...data
      }))
      .sort((a, b) => b.totalScore - a.totalScore);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard", error });
  }
});


module.exports = router;
