import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import "./EditQuiz.css";
const EditQuiz = () => {
  const { quizId } = useParams(); 
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem("user"));
  const teacherId = username.id;

  const [quizTitle, setQuizTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswerIndex: null },
  ]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (quizId) {
      fetch(`http://localhost:5000/api/quizzes/${quizId}`)
        .then((res) => res.json())
        .then((data) => {
          setQuizTitle(data.title || "");
          setDifficulty(data.difficulty || "");
          setTimeLimit(data.timeLimit || "");
          setQuestions(
            data.questions.map((q) => ({
              question: q.question,
              options: q.options,
              correctAnswerIndex: q.options.indexOf(q.correctAnswer),
            }))
          );
        })
        .catch((err) => console.error("Failed to load quiz:", err));
    }
  }, [quizId]);

  const addNewQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswerIndex: null }]);
  };

  const deleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim()) {
      setMessage("❌ Please enter a quiz title!");
      setTimeout(() => setMessage(""), 1500);
      return;
    }

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.options[q.correctAnswerIndex] || "",
    }));

    const quizData = {
      title: quizTitle,
      teacherId,
      difficulty,
      timeLimit,
      questions: formattedQuestions,
    };

    try {
      const url = quizId
        ? `http://localhost:5000/api/quizzes/${quizId}` 
        : `http://localhost:5000/api/quizzes`; 

      const method = quizId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        setMessage(`✅ Quiz ${quizId ? "updated" : "created"} successfully!`);
        setTimeout(() => setMessage(""), 1500);
      } else {
        setMessage("❌ Failed to save quiz!");
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  return (
    <div className="edit-quiz-container">
      <h2 className="title">{quizId ? "Edit Quiz" : "Create Quiz"}</h2>
      {message && <p className="message">{message}</p>}

      <div className="quiz-title-container">
        <div className="quiz-title">
          <label className="quiz-title-label">Quiz Title:</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="quiz-title-input"
            placeholder="Enter quiz title"
          />
        </div>
      </div>

      <div className="dropdown-container">
        <label>Difficulty Level:</label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="dropdown">
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="dropdown-container">
        <label>Time Limit:</label>
        <select value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} className="dropdown">
          <option value="">Select Time</option>
          <option value="10">10 Minutes</option>
          <option value="20">20 Minutes</option>
          <option value="30">30 Minutes</option>
        </select>
      </div>

      <div className="quiz-card">
        <h3 className="card-title">Questions</h3>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index} className="question-box">
              <label>Question:</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = e.target.value;
                  setQuestions(newQuestions);
                }}
                className="input-field"
              />

              <label>Options:</label>
              {["A", "B", "C", "D"].map((label, i) => (
                <div key={i} className="option-container">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctAnswerIndex === i}
                    onChange={() => {
                      const newQuestions = [...questions];
                      newQuestions[index].correctAnswerIndex = i;
                      setQuestions(newQuestions);
                    }}
                  />
                  <input
                    type="text"
                    value={q.options[i]}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].options[i] = e.target.value;
                      setQuestions(newQuestions);
                    }}
                    className="input-field"
                    placeholder={`${label}) Enter option`}
                  />
                </div>
              ))}

              <button className="delete-btn" onClick={() => deleteQuestion(index)}>
                Delete Question
              </button>
            </div>
          ))
        ) : (
          <p className="no-questions">No questions available</p>
        )}

        <button className="add-btn" onClick={addNewQuestion}>
          Add New Question
        </button>
        <button className="save-btn" onClick={saveQuiz}>
          Save Quiz
        </button>
        <button className="button back" onClick={() => navigate("/Testpage")}>
          ⬅ Back to Main Page
        </button>
      </div>
    </div>
  );
};

export default EditQuiz;
