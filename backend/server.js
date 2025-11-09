import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import textRoutes from "./routes/textRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/text", textRoutes);
app.use("/api/score", scoreRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "TypingSpeedX API is running!" });
});

// Initialize Socket.io
initializeSocket(io);

// Connect to MongoDB (optional - app works without it)
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/typing-speedx", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ Connected to MongoDB");
})
.catch((error) => {
  console.log("⚠️  MongoDB connection failed. App will work without database.");
  console.log("   To enable database features, start MongoDB or update MONGODB_URI in .env");
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
