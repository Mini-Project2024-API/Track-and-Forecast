import React from "react";
import "../styles/Announcement.css";

function Announcement() {
  return (
    <div className="announcement">
      <i className="fas fa-bullhorn icon"></i>
      <div className="content">
        <p className="title">Latest Announcement</p>
        <p className="message">Our new service is launching soon!</p>
        <p className="timestamp">Posted on August 30, 2024</p>
      </div>
    </div>
  );
}

export default Announcement;
