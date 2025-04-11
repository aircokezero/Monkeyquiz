import React from "react";

import { useNavigate } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user'));
  const acc = username.username
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("quizData");
    localStorage.removeItem("token");
    localStorage.removeItem("userAnswers");
    window.location.href = "/login";  
  };
  return (
    <div className="Navbar">
    <nav className="nav">
      <ul class="nav nav-main">
        <li>
          <a  onClick={()=>navigate("/")}><b>Monkey Quiz</b></a>
        </li>
        <li>
          <a  onClick={()=>navigate("/aboutus")}>About us</a>
        </li>
        <li>
          <a onClick={()=>navigate("/Contact")}>Contact us</a>
        </li>
        <li>
        <a onClick={handleLogout}>Log out</a>
        </li>
        <li>
          <a onClick={()=>navigate("/Dashboard")}>{acc}</a>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Navbar;
