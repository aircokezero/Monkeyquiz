import React, { useEffect, useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../component/QuizContext";
import "./QuizSol.css";

const QuizSol = () => {
  const navigate = useNavigate();
  const hasStored = useRef(false);
  const { quizData,selectedTopic,userAnswers, score, setUserAnswers, setScore, timeSpent, difficulty, setDifficulty, user } = useQuiz();
  const [resultStored, setResultStored] = useState(false);

  if (!quizData.length) return <div className="loading">Loading solutions...</div>;
  const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "hard" ? 3 : 2;
  const finalScore = score * difficultyMultiplier; 

  useEffect(() => {
    if (!hasStored.current && finalScore !== null && quizData.length > 0) {
      hasStored.current = true; 
  
      const storeQuizResult = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("User data not found");
          return;
        }
  
        try {
          const response = await fetch("http://localhost:5000/api/store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              username: user.username,
              topic: selectedTopic,
              difficulty,
              marks: finalScore,
            }),
          });
  
          if (!response.ok) throw new Error("Failed to store quiz result");
          setResultStored(true);
        } catch (error) {
          console.error("Error storing quiz result:", error);
        }
      };
  
      storeQuizResult();
    }
  }, [finalScore, quizData, difficulty, selectedTopic]);
  
  

  const handleReattempt = () => {
    setResultStored(false);
    setUserAnswers({});
    setScore(0);
    navigate("/quiz");
  };

  const handleBackToMain = () => {
    setUserAnswers({});
    setScore(0);
    navigate("/Testpage");
  };

  return (
    <div className="solution-container">
      <h1 className="title">Quiz Solutions</h1>
      <h2 className="score">Your Score: {finalScore} / {quizData.length * difficultyMultiplier}</h2>

      {quizData.map((question, index) => {
        const decodedQuestion = decodeHTML(question.question);
        const correctAnswer = decodeHTML(question.correct_answer);
        const userAnswer = decodeHTML(userAnswers[index] || "Not Answered");
        const isCorrect = userAnswer === correctAnswer;
        const timeTaken = timeSpent[index] || 0;

        
        let analysisMessage = "";
        if (userAnswer === "Not Answered") {
          analysisMessage = "You skipped this question. Try to attempt every question!";
        } else if (!isCorrect) {
          analysisMessage = timeTaken > 10 
            ? "You spent a lot of time but still got it wrong. Revise this topic!"
            : "You answered too quickly and got it wrong. Read the question carefully!";
        } else {
          analysisMessage = timeTaken > 10 
            ? "You took your time and got it right! Good job."
            : "You were confident and answered correctly! Keep it up.";
        }

        const options = [...question.incorrect_answers.map(decodeHTML), correctAnswer].sort(() => Math.random() - 0.5);

        return (
          <div key={index} className={`question-card ${isCorrect ? "correct" : "incorrect"}`}>
            <h3 className="question">{index + 1}. {decodedQuestion}</h3>
          
            <div className="question-row">
              <div className="options-container">
                {options.map((option, i) => (
                  <p key={i} id="op" className={`option ${option === correctAnswer ? "correct-answer" : ""}`}>
                    {option}
                  </p>
                ))}
                <div>
                  <p className="answer"><strong>Your Answer:</strong> {userAnswer}</p><br />
                  <p className="answer"><strong>Correct Answer:</strong> {correctAnswer}</p>
                </div>
              </div>

              <div className="analysis-box">
                <p className="time-spent"><strong>Time Spent:</strong> {timeTaken.toFixed(2)} sec</p><br />
                <p><strong>Analysis:</strong></p>
                <p>{analysisMessage}</p>
              </div>
            </div>
          </div>
        );
      })}

      <button className="button" onClick={handleReattempt}>Reattempt Quiz</button>
      <button className="button back" onClick={handleBackToMain}>Back to Main Page</button>
    </div>
  );
};


const decodeHTML = (text) => {
  const parser = new DOMParser().parseFromString(text, "text/html");
  return parser.documentElement.textContent;
};

export default QuizSol;