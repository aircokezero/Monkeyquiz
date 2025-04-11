import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const validateForm = async (e) => {
    e.preventDefault();

    if (username.trim().length < 3) {
      alert("Username must be at least 3 characters.");
      return;
    } else if (password.length <= 5) {
      alert("Password must be more than 5 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.puser));
        alert("Login Successful!");
        window.location.href ="/Testpage"; 
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Error logging in!");
    }
  };

  return (
    <div className="Login">
    <div className="container">
      <h2><b>Login to Monkey Quiz</b></h2>
      <hr />
      <br />
      <form onSubmit={validateForm}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />
        <div>
          <input type="submit" value="Login" />
        </div>
      </form>

      <p>Not Registered? <a href="/Signup">Create an account</a></p>
    </div>
    </div>
  );
};

export default Login;
