import React, { useEffect, useState, useRef,useContext,useMemo } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useQuiz } from "../component/QuizContext";

import "./QuizTest.css";

const QuizTest = () => {
  const navigate = useNavigate();
  const { quizData, userAnswers, setUserAnswers, score, setScore, timeSpent, setTimeSpent } = useQuiz(); 
  const location = useLocation();
  const isReattempt = location.state?.isReattempt || false;
  useEffect(() => {
    if (isReattempt) {
      console.log("User is retaking the quiz");
    }
  }, [isReattempt]);
  useEffect(() => {
    setUserAnswers({}); 
    setScore(0); 
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); 
  const [finished, setFinished] = useState(false);
  const [warn, setWarn] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  
  const questionStartTimeRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const questionTimerRef = useRef(null);
  const submittingRef = useRef(false);
  useEffect(() => {
    if (quizData.length > 0) {
      const initialTimeSpent = {};
      quizData.forEach((_, index) => {
        initialTimeSpent[index] = 0;
      });
      setTimeSpent(initialTimeSpent);
      
      questionStartTimeRef.current = Date.now();
      
      startQuestionTimer();
    }

    return () => {
      clearInterval(questionTimerRef.current);
    };
  }, [quizData, setTimeSpent]);

  const startQuestionTimer = () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
    
    questionTimerRef.current = setInterval(() => {
      if (questionStartTimeRef.current) {
        const elapsed = (Date.now() - questionStartTimeRef.current) / 1000;
        setCurrentQuestionTime(elapsed);
      }
    }, 100);
  };

  useEffect(() => {
    if (!finished && quizData.length === 0) {
      navigate("/");
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [quizData, finished, navigate]);

  useEffect(() => {
    let isFullscreenSupported = document.documentElement.requestFullscreen !== undefined;
    
    if (isFullscreenSupported) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Could not enter fullscreen mode:", err);
      });
    }
    
    const handleVisibilityChange = () => {
      if (document.hidden || !document.hasFocus()) {
        saveCurrentQuestionTime();
        handleSubmit();
      }
    };
    
    const handleBlur = () => {
      saveCurrentQuestionTime();
      handleSubmit();
    };
    
    const preventFullscreenExit = () => {
      if (!document.fullscreenElement && isFullscreenSupported) {
        saveCurrentQuestionTime();
        handleSubmit();
      }
    };

    document.addEventListener("fullscreenchange", preventFullscreenExit);
    document.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleKeydown = (e) => {
      const forbiddenKeys = ["F12", "F11", "Escape", "Tab", "Control", "Alt", "Meta", "Shift", "ArrowUp", "ArrowDown"];
      if (forbiddenKeys.includes(e.key) || (e.ctrlKey && e.shiftKey)) {
        e.preventDefault();
        setWarn((prevWarn) => {
          const newWarn = prevWarn + 1;
          setWarningMessage(`Don't press forbidden keys like ctrl, shift, alt, tab. Quiz will be auto-submitted. Warning: ${newWarn}/3`);
          setShowWarning(true);
          setTimeout(() => {
            setShowWarning(false);
          }, 5000);
          if (newWarn === 3) {
            saveCurrentQuestionTime();
            handleSubmit();
          }
          return newWarn;
        });
      }
    };

    const blockShortcuts = (e) => {
      if (["F5", "F12"].includes(e.key) || e.altKey) {
        e.preventDefault();
        saveCurrentQuestionTime();
        handleSubmit();
      }
    };

    const preventInspect = (e) => {
      if (e.button === 2 || ["Meta", "OS", "u", "U", "n", "N", "t", "T","Alt","Tab"].includes(e.key)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("mousedown", preventInspect, true);
    window.addEventListener("contextmenu", preventInspect, true);
    window.addEventListener("keydown", preventInspect, true);
    document.addEventListener("keydown", blockShortcuts);
    document.addEventListener("keydown", handleKeydown);

    return () => {
      saveCurrentQuestionTime();
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", preventFullscreenExit);
      document.removeEventListener("keydown", blockShortcuts);
      window.removeEventListener("mousedown", preventInspect, true);
      window.removeEventListener("contextmenu", preventInspect, true);
      window.removeEventListener("keydown", preventInspect);
    };
  }, [currentQuestion]);

  const saveCurrentQuestionTime = () => {
    if (questionStartTimeRef.current && !submittingRef.current) {
      const endTime = Date.now();
      const elapsedTime = (endTime - questionStartTimeRef.current) / 1000;
      
      if (elapsedTime > 0 && elapsedTime < 600) {
        setTimeSpent(prev => {
          const updatedTimeSpent = {...prev};
          updatedTimeSpent[currentQuestion] = (prev[currentQuestion] || 0) + elapsedTime;
          return updatedTimeSpent;
        });
      }
      
      questionStartTimeRef.current = Date.now();
    }
  };

  const decodeHTML = (text) => {
    const parser = new DOMParser().parseFromString(text, "text/html");
    return parser.documentElement.textContent;
  };

  const shuffleOptions = (question) => {
    const options = [...question.incorrect_answers.map(decodeHTML), decodeHTML(question.correct_answer)];
    return options.sort(() => Math.random() - 0.5);
  };
  const currentOptions = useMemo(() => {
    if (quizData.length === 0) return [];
    return shuffleOptions(quizData[currentQuestion]);
  }, [currentQuestion, quizData]);

  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prev) => {
      return { ...prev, [index]: answer };
    });
  };

  const handleNextQuestion = () => {
    saveCurrentQuestionTime();
    
    setCurrentQuestion((prev) => {
      const nextQuestion = Math.min(quizData.length - 1, prev + 1);
      questionStartTimeRef.current = Date.now();
      setCurrentQuestionTime(0);
      return nextQuestion;
    });
  };

  const handlePrevQuestion = () => {
    saveCurrentQuestionTime();
    
    setCurrentQuestion((prev) => {
      const prevQuestion = Math.max(0, prev - 1);
      questionStartTimeRef.current = Date.now();
      setCurrentQuestionTime(0);
      return prevQuestion;
    });
  };

  const handleSubmit = () => {
    if (finished || submittingRef.current) return;
    
    submittingRef.current = true;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
    
    if (questionStartTimeRef.current) {
      const endTime = Date.now();
      const elapsedTime = (endTime - questionStartTimeRef.current) / 1000;
      
      if (elapsedTime > 0 && elapsedTime < 600) {
        const finalTimeSpent = {...timeSpent};
        finalTimeSpent[currentQuestion] = (finalTimeSpent[currentQuestion] || 0) + elapsedTime;
        
        setTimeSpent(finalTimeSpent);
        
        questionStartTimeRef.current = null;
      }
    }
    
    setFinished(true);

    let newScore = 0;
    quizData.forEach((q, i) => {
      const correctAnswer = decodeHTML(q.correct_answer);
      if (userAnswers[i] && decodeHTML(userAnswers[i]) === correctAnswer) {
        newScore++;  
        setScore(newScore);
      }
    });
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Error exiting fullscreen:", err);
      });
    }

    setTimeout(() => {
      navigate("/quizsol", { replace: true ,state: { isReattempt }});
    }, 500);
  };
  
  if (!quizData.length) return <p className="loading">Loading quiz...</p>;

  return (
    <div className="bg">
      <div className="quiz-container">
        <div className="header">
          <div className="timer-box">
            <span className="timer-label">Time Left: </span>
            <span className="timer-value animation-pulse">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>
          <div className="progress-box">
            <span className="progress-label">Question:</span>
            <span className="progress-value">{currentQuestion + 1} / {quizData.length}</span>
          </div>
          <div className="time-spent-box">
            <span className="time-spent-label">Current question time:</span>
            <span className="time-spent-value animation-pulse">
              {currentQuestionTime.toFixed(1)}s
            </span>
          </div>
        </div>

        <div className="question-card">
          <h2 className="question">{decodeHTML(quizData[currentQuestion]?.question)}</h2>
          <div className="options">
            {currentOptions.map((option, idx) => (
              <label key={idx} className={`option ${userAnswers[currentQuestion] === option ? "selected" : ""}`}>
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
          </div>
        </div>

        <div className="controls">
          <button className="button prev" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
            Previous
          </button>
          <button className="button next" onClick={handleNextQuestion} disabled={currentQuestion === quizData.length - 1}>
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

export default QuizTest;