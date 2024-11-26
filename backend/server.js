const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const connectDB = require("./config/db");
const http = require("http");
const socketIo = require("socket.io");

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
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/auth", require("./routes/auth"));

// Train delay route - This now checks weather and sends notifications
app.post("/train-delay", async (req, res) => {
  const { trainName, location } = req.body;

  try {
    // Ensure WEATHER_API_KEY is in .env file
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`
    );

    const weatherData = weatherResponse.data;

    // Calculate delay based on rain data
    const rain = weatherData.rain?.["1h"] || 0;
    const delay = rain > 0 ? Math.ceil(rain * 10) : 5; // Predict delay based on rain
    const message = `Train ${trainName} is delayed by ${delay} minutes due to weather conditions in ${location}.`;

    // Emit notification to active connections
    activeConnections.forEach((socket) => {
      socket.emit("notification", { trainName, delay, location, message });
    });

    // Respond to the client
    res.json({ success: true, delay, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Unable to fetch data" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
