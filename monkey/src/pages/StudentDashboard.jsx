import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './studentdashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Quiz Performance',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const diff = context.dataset.label.toLowerCase().split(' ')[0]; // 'easy', 'medium', etc.
          const maxMarks = diff === 'easy' ? 10 : diff === 'medium' ? 20 : 30;
          const mark = context.parsed.y;
          return `${mark}/${maxMarks} marks`;
        }
      }
    }
  },
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("Computer");
  const username = JSON.parse(localStorage.getItem('user'));
  const acc = username.username;
  const usid = username.id;
  const [quizData, setQuizData] = useState([]);
 
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${usid}`);
        setQuizData(res.data);
      } catch (error) {
        console.error("Error fetching quizzes", error);
      }
    };
  
    fetchQuizzes();
  }, []);

  const getChartData = () => {
    const filtered = quizData.filter(quiz => quiz.topic.toLowerCase() === selectedSubject.toLowerCase());
  
    const difficulties = ['easy', 'medium', 'hard'];
    const colors = {
      easy: '#4CAF50',
      medium: '#2196F3',
      hard: '#FF9800',
    };
  
    const datasets = difficulties.map(diff => {
      const quizzesOfDifficulty = filtered.filter(q => q.difficulty === diff);

      const combinedMarks = quizzesOfDifficulty.flatMap(q => q.marks);
  
      return {
        label: `${diff.charAt(0).toUpperCase() + diff.slice(1)} (/${diff === 'easy' ? 10 : diff === 'medium' ? 20 : 30})`,
        data: combinedMarks,
        fill: false,
        borderColor: colors[diff],
        backgroundColor: colors[diff],
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      };
    });
  
    const maxLength = Math.max(...datasets.map(d => d.data.length));
    const attempts = Array.from({ length: maxLength }, (_, i) => `Attempt ${i + 1}`);
  
    return {
      labels: attempts,
      datasets
    };
  };
  

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">
          <div className="logo-text">Dashboard</div>
        </div>
        <ul className="nav-menu">
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <div className="greeting">
            <h1>Hello, {acc}! 👋</h1>
            <p>Here's your quiz performance overview</p>
          </div>
          <div className="header-actions">
            <div className="profile">
              <div className="profile-img">{acc[0]}</div>
              <span>{acc}</span>
            </div>
          </div>
        </div>

        <div className="charts">
          <div className="chart-container">
            <div className="chart-header">
              <div className="chart-title">Marks per Attempt</div>
              <select
                className="subject-dropdown"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {[...new Set(quizData.map(q => q.topic))].map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}

              </select>
            </div>
            <Line data={getChartData()} options={options} />
          </div>
        </div>

        <button className="button back" onClick={() => navigate("/Testpage")}>
          ⬅ Back to Main Page
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
