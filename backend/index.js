import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
// Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import userdataRoutes from "./routes/userdataRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import { startSubscriptionChecker } from "./utils/subscriptionChecker.js";

dotenv.config();
const port = process.env.PORT || 5000;

// Get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Middleware
app.use(cookieParser());
console.log("INDEX.JS LOADED - NO_COOKIES_FIX -", new Date().toISOString());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to verify server
app.get("/api/test", (req, res) => {
  res.status(200).json({
    message: "Server is running correctly",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/userdata", userdataRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://excel-crm.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB and start the server
console.log("INDEX.JS - Starting server at:", new Date().toISOString());
try {
  await connectDB();
  startSubscriptionChecker();
  server.listen(port, () => console.log(`Server running on port: ${port}`));
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
