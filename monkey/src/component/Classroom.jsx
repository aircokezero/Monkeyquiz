import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Classroom.css"; 

function Classroom({ user }) {
  const [classroomName, setClassroomName] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [createdClassrooms, setCreatedClassrooms] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) return; 
    if (user.role === "student") {
      fetchJoinedClassrooms();
    } else if (user.role === "teacher") {
      fetchCreatedClassrooms();
    }
  }, [user]);

  const fetchJoinedClassrooms = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/classrooms/student/alrjoined/${user.id}`);
      setClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching classrooms", error);
    }
  };

  const fetchCreatedClassrooms = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/classrooms/teacher/${user.id}`);
      setCreatedClassrooms(res.data);
    } catch (error) {
      console.error("Error fetching created classrooms", error);
    }
  };

  const createClassroom = async () => {
    if (!classroomName) return alert("Enter a classroom name");
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    try {
      const res = await axios.post("http://localhost:5000/api/classrooms/", {
        name: classroomName,
        code,
        createdBy: user.id,
      });
      setGeneratedCode(code);
      alert("Classroom created!");
      fetchCreatedClassrooms();
    } catch (error) {
      console.error("Error creating classroom", error);
    }
  };

  const joinClassroom = async () => {
    if (!joinCode) return alert("Enter a classroom code");
    try {
      await axios.post("http://localhost:5000/api/classrooms/join", {
        studentId: user.id,
        username: user.username,
        classroomCode: joinCode,
      });
      alert("Joined classroom!");
      fetchJoinedClassrooms();
    } catch (error) {
      console.error("Error joining classroom", error);
    }
  };
  
  return (
    <div className="classroom-container">
      <div className="left-panel">
        <div className="card small-card">
          {user.role === "teacher" ? (
            <>
              <h2>Create a Classroom</h2>
              <input
                type="text"
                placeholder="Classroom Name"
                value={classroomName}
                onChange={(e) => setClassroomName(e.target.value)}
                className="input"
              />
              <button onClick={createClassroom} className="btn btn-blue">
                Create Classroom
              </button>
              {generatedCode && <p className="code-display">Classroom Code: {generatedCode}</p>}
            </>
          ) : (
            <>
              <h2>Join a Classroom</h2>
              <input
                type="text"
                placeholder="Enter Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="input"
              />
              <button onClick={joinClassroom} className="btn btn-green">
                Join Classroom
              </button>
            </>
          )}
        </div>
      </div>

      <div className="right-panel">
        <h3>{user.role === "teacher" ? "Created Classrooms" : "Joined Classrooms"}</h3>
        <div className="classroom-grid">
          {(user.role === "teacher" ? createdClassrooms : classrooms).length > 0 ? (
            (user.role === "teacher" ? createdClassrooms : classrooms).map((cls) => (
              <button 
                key={cls._id} 
                className="classroom-card" 
                id="classcard"
                onClick={() => navigate(user.role === "teacher" ? `/classroom/${cls._id}` : `/joinedClass/${cls._id}`)}
              >
                <h4 id="txt">{cls.name}</h4>
                {user.role === "teacher" && <div className="code-copy">
                    <span id="txt">Code: {cls.code}</span>
                    <button 
                      className="copy-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(cls.code);
                        alert("Classroom code copied!");
                      }}
                    >
                      📋
                    </button>
                  </div>}
              </button>
            ))
          ) : (
            <p>{user.role === "teacher" ? "No classrooms created yet." : "No classrooms joined yet."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Classroom;
