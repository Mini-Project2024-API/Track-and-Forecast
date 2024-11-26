import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/PostAnnouncement.css";

function PostAnnouncement() {
  const location = useLocation();
  const [message, setMessage] = useState(location.state?.message || "");
  const teacherId = localStorage.getItem("teacherId"); // Get teacherId from localStorage

  const handlePost = async () => {
    if (!teacherId) {
      alert("Teacher not logged in or ID missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/notifications", // API URL to post announcement
        {
          message,
          teacherId, // Send teacherId with the announcement
        }
      );
      alert(response.data.message || "Announcement posted!");
    } catch (error) {
      alert("Failed to post announcement");
    }
  };

  return (
    <div className="post-announcement-container">
      <h2>Post Announcement</h2>
      <textarea
        className="announcement-textarea"
        placeholder="Write your announcement here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="post-button" onClick={handlePost}>
        Post
      </button>
    </div>
  );
}

export default PostAnnouncement;
