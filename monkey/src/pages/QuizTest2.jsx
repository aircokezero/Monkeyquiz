import React, { useEffect, useState } from "react";
import { useNavigate, useParams,useLocation  } from "react-router-dom";
import axios from "axios";
import "./QuizTest2.css";

const QuizTest2 = () => {
  const navigate = useNavigate();
  const { quizId } = useParams(); 
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [questionTime, setQuestionTime] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const location = useLocation();
  const classroomId = location.state?.classroomId;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quiz/${quizId}`);
        if (response.status !== 200) throw new Error("Quiz not found");
        setQuizData(response.data);
        if (response.data && response.data.questions) {
          const initialTimes = {};
          response.data.questions.forEach((_, idx) => {
            initialTimes[idx] = 0;
          });
          setQuestionTime(initialTimes);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (!quizData) return;
    setQuestionStartTime(Date.now());
    const interval = setInterval(() => {
      setQuestionTime(prev => {
        const updatedTimes = { ...prev };
        updatedTimes[currentQuestion] = (updatedTimes[currentQuestion] || 0) + 1;
        return updatedTimes;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentQuestion, quizData]);
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && !finished) {
      handleSubmit();
    }
  });

  useEffect(() => {
    document.body.requestFullscreen();
    
    const handleVisibilityChange = () => {
      if (document.hidden || !document.hasFocus()) handleSubmit();
    };
    const handleBlur = () => handleSubmit();
    const preventFullscreenExit = () => {
      if (!document.fullscreenElement) handleSubmit();
    };

    const handleKeydown = (e) => {
      const forbiddenKeys = ["F12", "F11", "Escape", "Tab", "Control", "Alt", "Meta", "Shift", "ArrowUp", "ArrowDown"];
      if (forbiddenKeys.includes(e.key) || (e.ctrlKey && e.shiftKey)) {
        e.preventDefault(); 
        setWarn((prevWarn) => {
          const newWarn = prevWarn + 1;
          setWarningMessage(`Don't press forbidden keys! Warning: ${newWarn}/3`);
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 5000);
          if (newWarn === 3) handleSubmit();
          return newWarn;
        });
      }
    };

    const blockShortcuts = (e) => {
      if (["F5", "F12"].includes(e.key) || e.altKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    const preventInspect = (e) => {
      if (e.button === 2 || ["Meta", "OS", "u", "U", "n", "N", "t", "T"].includes(e.key)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("fullscreenchange", preventFullscreenExit);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keydown", blockShortcuts);
    window.addEventListener("mousedown", preventInspect, true);
    window.addEventListener("contextmenu", preventInspect, true);
    window.addEventListener("keydown", preventInspect, true);

    return () => {
      document.removeEventListener("fullscreenchange", preventFullscreenExit);
      document.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keydown", blockShortcuts);
      window.removeEventListener("mousedown", preventInspect, true);
      window.removeEventListener("contextmenu", preventInspect, true);
      window.removeEventListener("keydown", preventInspect, true);
    };
  }, []);

  useEffect(() => {
    if (!quizData) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizData]);

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const handleNavigateQuestion = (direction) => {

    const endTime = Date.now();
    const questionDuration = questionStartTime ? Math.floor((endTime - questionStartTime) / 1000) : 0;
    setQuestionTime(prev => {
      return {
        ...prev,
        [currentQuestion]: prev[currentQuestion] + questionDuration
      };
    });
    setCurrentQuestion(prev => prev + direction);
  };

  const handleSubmit = () => {
    if (finished) return;
    setFinished(true);
    if (questionStartTime) {
      const endTime = Date.now();
      const questionDuration = Math.floor((endTime - questionStartTime) / 1000);
      
      setQuestionTime(prev => ({
        ...prev,
        [currentQuestion]: prev[currentQuestion] + questionDuration
      }));
    }

    let newScore = 0;
    quizData.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer.trim()) newScore++;
    });
    setScore(newScore);
    document.exitFullscreen();
    navigate("/solution", {
      state: {
        quizData,
        userAnswers,
        score: newScore,
        questionTime, 
        currentQuestionIndex: currentQuestion, 
        classroomId:classroomId,
      },
      replace: true,
    });
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quizData) return <p>Error: Quiz not found.</p>;

  return (
    <div className="bg">
      <div className="quiz-test-container">
        <div className="timer">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
        
        <p className="question-time">
          Time on this question: {questionTime[currentQuestion] || 0} seconds
        </p>

        <h3>Question {currentQuestion + 1} of {quizData.questions.length}</h3>
        <h2>{quizData.questions[currentQuestion]?.question}</h2>
        {quizData.questions[currentQuestion]?.options.map((option, idx) => (
          <label key={idx} className="option-label">
            <input
              type="radio"
              name={`question-${currentQuestion}`}
              value={option}
              checked={userAnswers[currentQuestion] === option}
              onChange={() => handleAnswerChange(currentQuestion, option)}
            />
            {option}
          </label>
        ))}

        <div className="controls">
          <button 
            className="button prev" 
            onClick={() => handleNavigateQuestion(-1)} 
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button 
            className="button next" 
            onClick={() => handleNavigateQuestion(1)} 
            disabled={currentQuestion === quizData.questions.length - 1}
          >
            Next
          </button>
        </div>

        <button className="button submit" onClick={handleSubmit}>Submit Quiz</button>

        {showWarning && (
          <div className={`warning-box ${!showWarning ? "fade-out" : ""}`}>
            {warningMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTest2;