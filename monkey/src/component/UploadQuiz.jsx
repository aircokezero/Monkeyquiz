import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../component/UploadQuiz.css"; 

const UploadQuiz = ({ classroomId, onQuizUpload }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const username = JSON.parse(localStorage.getItem('user'));
        const teachId = username.id;
        const response = await fetch(`http://localhost:5000/api/createdquizzes?teacherId=${teachId}`);
        const data = await response.json();
        setQuizzes(data.map(q => ({ value: q._id, label: q.title })));
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleUpload = async () => {
    if (!selectedQuiz) {
      alert("Please select a quiz.");
      return;
    }
    setLoading(true);

    try {
      const checkResponse = await fetch(`http://localhost:5000/api/classrooms/v2/check`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId:classroomId ,quizId: selectedQuiz.value }),
      });

      const checkData = await checkResponse.json();
      if (checkData.exists) {
        alert("Quiz is already added to this classroom!");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/classrooms/v2/uploadQuiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomId:classroomId ,quizId: selectedQuiz.value }),
      });
      if (!response.ok) {
        throw new Error("Failed to upload quiz.");
      }
      alert("Quiz uploaded successfully!");
      setSelectedQuiz(null);
      onQuizUpload(); 
    } catch (error) {
      console.error("Error uploading quiz:", error);
      alert("Failed to upload quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload a Quiz</h2>
      <Select
        options={quizzes}
        value={selectedQuiz}
        onChange={setSelectedQuiz}
        placeholder="Select a quiz..."
        isSearchable
        className="select-dropdown"
      />
      <button className="upload-button" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Quiz"}
      </button>
    </div>
  );
};

export default UploadQuiz;
