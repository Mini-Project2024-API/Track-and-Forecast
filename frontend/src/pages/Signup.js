import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/Signup.css";

function Signup() {
  const [userType, setUserType] = useState("student");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          fullname,
          email,
          password,
          userType,
        }
      );
      localStorage.setItem("authToken", response.data.token);
      setAlert({ type: "success", message: "Signup successful!" });
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setAlert({ type: "danger", message: "Signup failed. Please try again." });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create an Account</h2>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="user-type-selection">
            <label>
              <input
                type="radio"
                value="student"
                checked={userType === "student"}
                onChange={handleUserTypeChange}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="teacher"
                checked={userType === "teacher"}
                onChange={handleUserTypeChange}
              />
              Teacher
            </label>
            <label>
              <input
                type="radio"
                value="other"
                checked={userType === "other"}
                onChange={handleUserTypeChange}
              />
              Other
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {userType === "student" && (
            <div className="form-group">
              <label htmlFor="student-id">Student ID</label>
              <input type="text" id="student-id" required />
            </div>
          )}

          {userType === "teacher" && (
            <div className="form-group">
              <label htmlFor="teacher-id">Teacher ID</label>
              <input type="text" id="teacher-id" required />
            </div>
          )}

          <button type="submit" className="signup-button">
            Signup
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
