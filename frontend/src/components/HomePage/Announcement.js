import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../styles/Announcement.css";

function Announcement() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch announcements
    axios
      .get("http://localhost:5000/api/notifications")
      .then((response) => setNotifications(response.data))
      .catch((error) => console.error(error));

    // Listen for new notifications
    const socket = io("http://localhost:5000");
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="announcement-container">
      <h2>Announcements</h2>
      <ul className="announcement-list">
        {notifications.map((notif, index) => (
          <li key={index} className="announcement-item">
            <p>{notif.message}</p>
            <span>
              <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Announcement;
