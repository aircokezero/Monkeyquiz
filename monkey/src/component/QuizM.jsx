import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "./QuizContext"; // Import context
import Classroom from "./Classroom";
import CreateQuiz from "./CreateQuiz";
import Leaderboard from "./Leaderboard";
import "./QuizM.css";

function QuizM() {
    const navigate = useNavigate();
    const { fetchQuiz, difficulty, setDifficulty, user } = useQuiz();
    const [topic, setTopic] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const username = JSON.parse(localStorage.getItem('user'));
    const usid = username.id;
    const topics = ["math", "computer", "science"];

    const isDevToolsOpen = () => {
        const threshold = 160;
        const start = new Date();
        debugger;
        const end = new Date();
        return end - start > threshold;
      };


    const handleStartQuiz = async () => {
        if (!topic.trim()) {
            alert("Please select a topic before starting the quiz.");
            return;
        }
        if (isDevToolsOpen()) {
            alert("Please close DevTools before starting the quiz.");
            return;
        }
        await fetchQuiz(topic, difficulty);
        navigate("/quiz");
    };

    return (
        <div className="QuizM">
            <div className="info_and_lb">
                <table className="tb">
                    <tbody>
                        <tr>
                            <td className="info">
                                <div className="srh">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                    
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                placeholder="Search Topic (Math, Science, Computer)"
                                                value={topic}
                                                onChange={(e) => {
                                                    setTopic(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            />
                                            {showSuggestions && (
                                                <ul className="autocomplete-list">
                                                    {topics
                                                        .filter(t => t.startsWith(topic.toLowerCase()))
                                                        .map((suggestion, idx) => (
                                                            <li
                                                                key={idx}
                                                                onMouseDown={() => {
                                                                    setTopic(suggestion);
                                                                    setShowSuggestions(false);
                                                                }}
                                                            >
                                                                {suggestion}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            )}
                                        </div>
                                    </form>
                                    <div className="dis">
                                        <div className="dif">
                                            <p>Select your Difficulty Level:</p>
                                        </div>
                                        <div className="checkbox-group">
                                            {["easy", "medium", "hard"].map((level) => (
                                                <label key={level} className="checkbox-label">
                                                    <input
                                                        type="radio"
                                                        name="difficulty"
                                                        value={level}
                                                        checked={difficulty === level}
                                                        onChange={() => setDifficulty(level)}
                                                    />
                                                    <span className="custom-box">{level.charAt(0).toUpperCase() + level.slice(1)}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="start-test-btn" onClick={handleStartQuiz}>Start Test</button>
                                    <br />
                                    <div className="quiz-info-container">
                                      <p className="quiz-info-text">Your score is based on difficulty and questions attempted:</p>
                                      <ul className="quiz-info-list">
                                        <li><strong>Easy:</strong> ×1 per question</li>
                                        <li><strong>Medium:</strong> ×2 per question</li>
                                        <li><strong>Hard:</strong> ×3 per question</li>
                                      </ul>
                                    </div>
                                                                            
                                                                            
                                </div>
                            </td>
                            <td className="lb">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Leaderboard currentUserId={usid} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <div className="room">
                                    <Classroom user={user} />
                                </div>
                            </td>
                        </tr>
                        {user.role === "teacher" && (
                            <tr>
                                <td colSpan="2">
                                    <div className="room2">
                                        <CreateQuiz user={user} />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default QuizM;
