// src/components/StudentDashboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("http://localhost:8000/student/notifications/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data.notifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Student Dashboard</h2>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message} (from: {notification.sender})</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentDashboard;
