import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TestPage from "./pages/TestPage";
import QuizTest from "./pages/QuizTest";
import EditQuiz from "./pages/EditQuiz";
import QuizSol from "./pages/QuizSol";
import QuizSol2 from "./pages/QuizSol2";
import ClassroomPage from "./pages/ClassroomPage";
import QuizTest2 from "./pages/QuizTest2";
import JoinedClass from "./pages/JoinedClass";
import { QuizProvider } from "./component/QuizContext";
import StudentDashboard from "./pages/StudentDashboard";
import Home from "./pages/Home";
import ContactForm from "./pages/ContactForm";
import AboutUs from "./pages/AboutUs";

function App() {
  return (
    <QuizProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup/>}/>
        <Route path="/TestPage" element={<TestPage/>} />
        <Route path="/quiz" element={<QuizTest/>}/>
        <Route path="/quiz/:quizId" element={<QuizTest2/>}/>
        <Route path="/editquiz/:quizId?" element={<EditQuiz />} />
        <Route path="/quizsol" element={<QuizSol/>}/>
        <Route path="/solution" element={<QuizSol2/>}/>
        <Route path="/classroom/:classroomId" element={<ClassroomPage/>}/>
        <Route path="/joinedClass/:classroomId" element={<JoinedClass/>}/>
        <Route path="/Dashboard" element={<StudentDashboard/>}/>
        <Route path="/Contact" element={<ContactForm/>}/>
        <Route path="/aboutus" element={<AboutUs/>}/>
        
      </Routes>
    </Router>
    </QuizProvider>
  );
}

export default App;