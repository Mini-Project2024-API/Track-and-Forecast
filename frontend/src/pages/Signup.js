import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/alert.css";
import "../components/styles/Signup.css";

function Signup() {
  const [userType, setUserType] = useState("student");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        fullname,
        email,
        password,
        userType,
      };

      if (userType === "student") {
        userData.studentId = studentId;
      } else if (userType === "teacher") {
        userData.teacherId = teacherId;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userData
      );

      localStorage.setItem("authToken", response.data.token);

      // Dispatch the custom "authChange" event
      window.dispatchEvent(new Event("authChange"));

      navigate("/", {
        state: { alert: { type: "success", message: "Signup successful!" } },
      });
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
            <i
              className={`alert-icon fas fa-${
                alert.type === "success"
                  ? "check-circle"
                  : alert.type === "danger"
                  ? "exclamation-circle"
                  : "info-circle"
              }`}
            ></i>
            <div className="alert-message">{alert.message}</div>
            <button onClick={() => setAlert(null)} className="close-alert">
              &times;
            </button>
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
              <input
                type="text"
                id="student-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>
          )}

          {userType === "teacher" && (
            <div className="form-group">
              <label htmlFor="teacher-id">Teacher ID</label>
              <input
                type="text"
                id="teacher-id"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
              />
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
