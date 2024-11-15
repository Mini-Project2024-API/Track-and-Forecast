// src/components/TeacherDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [notifications, setNotifications] = useState([]);
  const [forwardMessage, setForwardMessage] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/teacher/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
    };

    fetchNotifications();
  }, []);

  const handleForward = async () => {
    const token = localStorage.getItem("authToken");
    await axios.post(
      "http://localhost:8000/teacher/forward-notification/",
      {
        message: forwardMessage,
        recipient: "student@example.com",  // Replace with actual student email
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setForwardMessage(""); // Clear the input after sending
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message} (from: {notification.sender})</li>
        ))}
      </ul>

      <h3>Forward Notification to Student</h3>
      <input
        type="text"
        value={forwardMessage}
        onChange={(e) => setForwardMessage(e.target.value)}
        placeholder="Enter message to forward"
      />
      <button onClick={handleForward}>Forward</button>
    </div>
  );
}

export default TeacherDashboard;
