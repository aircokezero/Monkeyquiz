import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../component/ClassroomQuizzes.css";

const ClassroomQuizzes = ({ classroomId, refresh }) => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || ""; 

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classrooms/v2/fetch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classroomId })
        });
        const data = await response.json();
        setQuizzes(data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [classroomId, refresh]);

  return (
    <div className="quizzes-container">
      <h2>Uploaded Quizzes</h2>
      {quizzes.length > 0 ? (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz._id} className="quiz-item">
            <span className="quiz-title">{quiz.title}</span>
          
            {role === "student" && (
              <button
                className="start-quiz-button"
                onClick={() => navigate(`/quiz/${quiz._id}`,{state:{classroomId:classroomId}})}
              >
                Start Quiz
              </button>
            )}
          </li>
          ))}
        </ul>
      ) : (
        <p className="no-quizzes">No quizzes uploaded yet.</p>
      )}
    </div>
  );
};

export default ClassroomQuizzes;
