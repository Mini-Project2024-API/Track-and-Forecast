import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/alert.css";
import "../components/styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("authToken", response.data.token);
      window.dispatchEvent(new Event("authChange"));

      navigate("/", {
        state: { alert: { type: "success", message: "Login successful!" } },
      });
    } catch (err) {
      setAlert({ type: "danger", message: "Login failed. Please try again." });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
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

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>.
        </p>
      </div>
    </div>
  );
}

export default Login;
