import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./QuizSol.css";

const QuizSol2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasStored = useRef(false);
  const [resultStored, setResultStored] = useState(false);
  const { state } = location || {};


  const {
    quizData = {},
    userAnswers = {},
    score = 0,
    questionTime = {},
    classroomId
  } = state || {};


  useEffect(() => {

    setResultStored(false);
    hasStored.current = false;
    

    if (!state || !quizData || !quizData.questions) {
      console.error("Missing or invalid quiz data");
      navigate("/Testpage");
    }
    
    return () => {

      hasStored.current = false;
    };
  }, []);
  
  if (!quizData) {
    console.error("Quiz data is undefined");
    return <div className="loading">Error: Quiz data is missing</div>;
  }
  

  const difficulty = quizData.difficulty || "medium";
  const selectedTopic = quizData.title || "Unknown Topic";
  
  const difficultyMultiplier =
    difficulty === "easy" ? 1 : difficulty === "hard" ? 3 : 2;
  const finalScore = score * difficultyMultiplier;

 useEffect(() => {
    if (
      !hasStored.current &&
      finalScore !== null &&
      quizData.questions.length > 0
    ) {
      hasStored.current = true;

      const storeQuizResult = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.id) {
          console.error("User data not found");
          return;
        }

        try {
          const response = await fetch("http://localhost:5000/api/classrooms/v2/storeSol", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              classroomId:classroomId,
              username: user.username,
              topic: selectedTopic,
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
  }, [finalScore, quizData, selectedTopic]);

  const handleReattempt = () => {
    navigate(`/quiz/${quizData._id}`, { 
        state: { 
          classroomId: classroomId,
        },
        replace: true
      });
  };

  const handleBackToMain = () => {
    navigate("/Testpage");
  };

  return (
    <div className="solution-container">
      <h1 className="title">Quiz Solutions</h1>
      <h2 className="score">
        Your Score: {finalScore} /{" "}
        {quizData.questions.length * difficultyMultiplier}
      </h2>

      {quizData.questions.map((question, index) => {
        if (!question) {
          console.error(`Question at index ${index} is undefined`);
          return <div key={index}>Error loading question {index+1}</div>;
        }
        
        const questionText = question.question || "Missing question text";
        const correctAnswer = question.correctAnswer || "Missing correct answer";
        const options = Array.isArray(question.options) ? question.options : [];
        const userAnswer = (userAnswers && userAnswers[index]) || "Not Answered";
        const isCorrect = userAnswer === correctAnswer;

        const timeTaken = typeof questionTime[index] === 'number' ? questionTime[index] : 0;

        let analysisMessage = "";
        if (userAnswer === "Not Answered") {
          analysisMessage =
            "You skipped this question. Try to attempt every question!";
        } else if (!isCorrect) {
          analysisMessage =
            timeTaken > 10
              ? "You spent a lot of time but still got it wrong. Revise this topic!"
              : "You answered too quickly and got it wrong. Read the question carefully!";
        } else {
          analysisMessage =
            timeTaken > 10
              ? "You took your time and got it right! Good job."
              : "You were confident and answered correctly! Keep it up.";
        }

        return (
          <div
            key={question._id || index}
            className={`question-card ${isCorrect ? "correct" : "incorrect"}`}
          >
            <h3 className="question">
              {index + 1}. {questionText}
            </h3>

            <div className="question-row">
              <div className="options-container">
                {options.map((option, i) => (
                  <p
                    key={i} id="op"
                    className={`option ${
                      option === correctAnswer ? "correct-answer" : ""
                    }`}
                  >
                    {option}
                  </p>
                ))}
                <div>
                  <p className="answer">
                    <strong>Your Answer:</strong> {userAnswer}
                  </p>
                  <br />
                  <p className="answer">
                    <strong>Correct Answer:</strong> {correctAnswer}
                  </p>
                </div>
              </div>

              <div className="analysis-box">
                <p className="time-spent">
                  <strong>Time Spent:</strong> {timeTaken} sec
                </p>
                <br />
                <p>
                  <strong>Analysis:</strong>
                </p>
                <p>{analysisMessage}</p>
              </div>
            </div>
          </div>
        );
      })}

      <button className="button" onClick={handleReattempt}>
        Reattempt Quiz
      </button>
      <button className="button back" onClick={handleBackToMain}>
        Back to Main Page
      </button>
    </div>
  );
};

export default QuizSol2;