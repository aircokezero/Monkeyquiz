import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateQuiz.css";

function CreateQuiz({ user }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    
    if (user.role === "teacher") {
      fetchCreatedQuizzes();
    }
  }, [user]);
  const fetchCreatedQuizzes = async () => {
    try {
        const storedUser = localStorage.getItem("user");
        const userData = JSON.parse(storedUser);
        const teacherId = userData?.id
        
        if (!teacherId) {
            console.error("No teacher ID found");
            return;
        }

        const response = await axios.get(`http://localhost:5000/api/createdquizzes?teacherId=${teacherId}`);
        setCreatedQuizzes(response.data);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
    }
};
  const createQuiz = async () => {
    if (!quizTitle) return alert("Enter a quiz title");

    try {
      const res = await axios.post("http://localhost:5000/api/quizzes", {
        title: quizTitle,
        createdBy: user.id,
      });
      alert("Quiz created!");
      setQuizTitle("");
      fetchCreatedQuizzes();
    } catch (error) {
      console.error("Error creating quiz", error);
    }
  };

  return (
    <div className="classroom-container">
      {/* Left Panel - Create Quiz */}
      <div className="left-panel">
        <div className="card small-card">
          <h2>Create a Quiz</h2>
          <button onClick={() => {
            navigate("/editquiz")
          }} className="btn btn-blue">
            Create Quiz
          </button>
        </div>
      </div>

      {/* Right Panel - Quizzes List */}
      <div className="right-panel">
        <h3>Created Quizzes</h3>
          <div className="classroom-grid">
          {createdQuizzes.length > 0 ? (
            createdQuizzes.map((quiz) => (
              <div key={quiz._id} className="classroom-card" style={{ position: "relative" }}>
                <h4>{quiz.title}</h4>
            
                {/* Menu Button */}
                <div className="menu-container">
                  <button
                    className="menu-btn"
                    onClick={() => {
                      const current = document.getElementById(`menu-${quiz._id}`);
                      current.style.display = current.style.display === "block" ? "none" : "block";
                    }}
                  >
                    ⋮
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div
                    className="dropdown-menu"
                    id={`menu-${quiz._id}`}
                    style={{
                      display: "none",
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      borderRadius: "5px",
                      zIndex: 10,
                    }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate(`/editquiz/${quiz._id}`);
                      }}
                    >
                      Edit Quiz
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate(`/quiz/${quiz._id}`);
                      }}
                    >
                      Give Test
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No quizzes created yet.</p>
          )}

        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;
