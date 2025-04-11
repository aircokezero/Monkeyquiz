import React, { useEffect, useState } from "react";
import "../component/StudentList.css";

const StudentList = ({ classroomId }) => {
  const [students, setStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState({});

  useEffect(() => {
    const fetchStudentsAndMarks = async () => {
      try {
        // Fetch classroom and student list
        const response = await fetch(`http://localhost:5000/api/classrooms/v2/${classroomId}`);
        const data = await response.json();
        const studentList = data.students || [];
        setStudents(studentList);

        // Fetch student solutions
        const solRes = await fetch(`http://localhost:5000/api/classrooms/v2/studentsol/${classroomId}`);
        const solutions = await solRes.json();

        const marksMap = {};

        solutions.forEach(sol => {
          // Normalize classroomId and userId
          const solClassroomId = sol.classroomId?.toString().trim();
          const solUserId = sol.userId?.toString().trim();

          if (solClassroomId === classroomId?.toString().trim()) {
            const firstMark = Array.isArray(sol.marks) ? sol.marks[0] : 0;
            if (solUserId) {
              marksMap[solUserId] = firstMark;
            }
          }
        });

        console.log("Final marksMap:", marksMap);
        setStudentMarks(marksMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentsAndMarks();
  }, [classroomId]);

  // Sort students by marks
  const sortedStudents = [...students].sort((a, b) => {
    const marksA = studentMarks[a._id?.toString()] || 0;
    const marksB = studentMarks[b._id?.toString()] || 0;
    return marksB - marksA;
  });

  return (
    <div className="student-list-container">
      <h2>Students Joined</h2>
      {students.length > 0 ? (
        <ul className="student-list">
          {sortedStudents.map((student, index) => {
            const idStr = student._id?.toString();
            const marks = studentMarks[idStr] ?? 0;

            console.log(`Student: ${student.username}, ID: ${idStr}, Marks: ${marks}`);

            return (
              <li key={index} className="student-item">
                <span className="student-name">{student.username}</span>
                <span className="student-marks">{marks} Marks</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="no-students">No students have joined yet.</p>
      )}
    </div>
  );
};

export default StudentList;
