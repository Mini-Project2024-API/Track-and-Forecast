import React, { useState, useEffect } from "react";
import axios from "axios";
import "../components/styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "", // 'success' or 'error'
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setUser(response.data.user);
      setFormData({
        fullname: response.data.user.fullname,
        email: response.data.user.email,
        password: "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      await fetchUserData();
      setEditMode(false);
      setAlert({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setAlert({
        show: true,
        message: "Error updating profile. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Profile</h2>
        {alert.show && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show`}
            role="alert"
          >
            {alert.message}
            <button
              type="button"
              className="close"
              onClick={() => setAlert({ ...alert, show: false })}
            >
              <span>&times;</span>
            </button>
          </div>
        )}
        {user && (
          <>
            <div className="profile-header">
              <img
                src={`https://via.placeholder.com/150?text=${user.fullname.charAt(
                  0
                )}`}
                alt="Profile"
                className="profile-picture"
              />
              <div className="profile-details">
                <h3>{user.fullname}</h3>
                <p>Email: {user.email}</p>
                <p>User Type: {user.userType}</p>
              </div>
            </div>

            {editMode ? (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">New Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </form>
            ) : (
              <button onClick={() => setEditMode(true)} className="edit-button">
                Edit Profile
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
