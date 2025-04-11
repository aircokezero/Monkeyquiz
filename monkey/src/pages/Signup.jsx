import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // Import the CSS file

const Signup = () => {
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, email, password, confirmPassword } = formData;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (username.length < 3) {
      alert("Name must be at least 3 characters.");
      return false;
    }
    if (password.length <= 5) {
      alert("Password must be more than 5 characters.");
      return false;
    }
    if (confirmPassword !== password) {
      alert("Passwords do not match.");
      return false;
    }
    if (!emailPattern.test(email)) {
      alert("Invalid email format.");
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: role,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("token", data.token); 
          localStorage.setItem("user", JSON.stringify(data.puser));
          alert("Signup Successful!");
          navigate("/Login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert("Error signing up!");
      }
    }
  };
  

  return (
    <div className="Signup">
    <div className="container">
      <h2><b>Create an Account on Monkey Quiz</b></h2>
      <hr />
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            name="username"
            id="username"
            type="text"
            placeholder="Enter a valid username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="text"
            placeholder="Enter an email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Enter a valid password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Enter the password again"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <h2 className="role">What is your role?</h2>
        <div className="role-selection">

      <label
        className={`role-option ${role === "student" ? "selected" : ""}`}
        onClick={() => setRole("student")}
      >
        Student
        <input
          type="radio"
          name="role"
          value="student"
          checked={role === "student"}
          onChange={() => setRole("student")}
        />
      </label>

      <label
        className={`role-option ${role === "teacher" ? "selected" : ""}`}
        onClick={() => setRole("teacher")}
      >
        Teacher
        <input
          type="radio"
          name="role"
          value="teacher"
          checked={role === "teacher"}
          onChange={() => setRole("teacher")}
        />
      </label>
    </div>
        <br />
        <div>
          <input type="submit" value="Sign Up" />
        </div>
      </form>
      <p>Already have an account? <a href="/Login">Sign in</a></p>
    </div>
    </div>
  );
};

export default Signup;
