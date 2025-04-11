import React, { createContext, useState, useContext } from "react";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
    const [quizData, setQuizData] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [difficulty, setDifficulty] = useState("any");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeSpent, setTimeSpent] = useState({}); // New state for time tracking

    const fetchQuiz = async (topic, difficulty) => {
        try {
            let apiUrl = `https://opentdb.com/api.php?amount=10`;
            if (difficulty !== "any") {
                apiUrl += `&difficulty=${difficulty.toLowerCase()}`;
            }
            const topicCategories = {
                math: 19,
                computer: 18,
                science: 17
            };
            const formattedTopic = topic.toLowerCase().trim();
            if (topicCategories[formattedTopic]) {
                apiUrl += `&category=${topicCategories[formattedTopic]}`;
            }
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.results) {
                setQuizData(data.results);
                setSelectedTopic(formattedTopic);
            }
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        }
    };
    
    return (
        <QuizContext.Provider 
            value={{ 
                quizData, selectedTopic, difficulty, setDifficulty, fetchQuiz, 
                user, score, userAnswers, setScore, setUserAnswers, 
                timeSpent, setTimeSpent 
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
