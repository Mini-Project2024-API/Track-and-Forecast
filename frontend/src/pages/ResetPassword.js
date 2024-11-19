import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../components/styles/ResetPassword.css";

function ResetPassword() {
  const { resetToken } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${resetToken}`,
        { newPassword }
      );
      setAlert({ type: "success", message: "Password reset successfully!" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setAlert({
        type: "danger",
        message: "Error resetting password. Please try again.",
      });
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert">
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
