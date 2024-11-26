const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");
const Notification = require("./models/Notification");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend URL
    methods: ["GET", "POST"],
  },
});

let activeConnections = [];

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  activeConnections.push(socket);

  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
    activeConnections = activeConnections.filter((conn) => conn !== socket);
  });
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notifications", require("./routes/notifications"));

// Post Announcement Route
app.post("/api/notifications", async (req, res) => {
  const { message, teacherId } = req.body;

  if (!message || !teacherId) {
    return res
      .status(400)
      .json({ message: "Message and teacherId are required" });
  }

  try {
    // Check if the teacher is valid or not
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.userType !== "teacher") {
      return res
        .status(403)
        .json({ message: "Invalid teacher or teacher not logged in" });
    }

    const newNotification = new Notification({
      message,
      postedBy: teacherId,
      createdAt: new Date(),
    });

    await newNotification.save();

    activeConnections.forEach((socket) =>
      socket.emit("notification", { message, createdAt: new Date() })
    );

    res.status(201).json({ message: "Announcement posted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to post announcement" });
  }
});

// All notifications route
app.get("/api/notifications", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("postedBy", "fullname")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
