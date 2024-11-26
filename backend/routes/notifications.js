const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.post("/", async (req, res) => {
  const { message, teacherId } = req.body;

  if (!message || !teacherId) {
    return res
      .status(400)
      .json({ message: "Message and teacherId are required" });
  }

  try {
    const newNotification = new Notification({
      message,
      postedBy: teacherId, // Associate notification with teacher
    });

    await newNotification.save();

    // notification for all active connections
    activeConnections.forEach((socket) => {
      socket.emit("notification", { message: newNotification.message });
    });

    res.status(201).json({ message: "Announcement posted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post notification" });
  }
});

module.exports = router;
