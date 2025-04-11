import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UploadQuiz from "../component/UploadQuiz";
import StudentList from "../component/StudentList";
import ClassroomQuizzes from "../component/ClassroomQuizzes";
import "../pages/ClassroomPage.css";

const ClassroomPage = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [refreshQuizzes, setRefreshQuizzes] = useState(false);
  const [classroom, setClassroom] = useState(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [createdBy,setCreatedBy]=useState("")

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classrooms/v2/${classroomId}`);
        const data = await response.json();
        setClassroom(data.classroom);
        setStudentsCount(data.students.length);
        setCreatedBy(data.name);
      } catch (error) {
        console.error("Error fetching classroom data:", error);
      }
    };

    fetchClassroomData();
  }, [classroomId]);

  const handleQuizUpload = () => {
    setRefreshQuizzes((prev) => !prev);
  };

  return (
    <div className="classroom-wrapper">
      <div className="classroom-info">
        <h1>{classroom ? classroom.name : "Loading..."}</h1>
        <p>Created by: <span className="classroom-teacher">{createdBy}</span></p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p>Students Enrolled: <span className="classroom-student-count">{studentsCount}</span></p>
      </div>

      <div className="classroom-main">
        <div className="classroom-left">
          <div className="quiz-upload">
            <UploadQuiz classroomId={classroomId} onQuizUpload={handleQuizUpload} />
          </div>
          <div className="quiz-list">
            <ClassroomQuizzes classroomId={classroomId} refresh={refreshQuizzes} />
          </div>
          <div className="navigation-button">
            <button onClick={() => navigate("/Testpage")}>Back to Main Page</button>
          </div>
        </div>

        <div className="classroom-right">
          <h2>Students in Classroom</h2>
          <StudentList classroomId={classroomId} />
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;
