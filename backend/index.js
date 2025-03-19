import path from "path";
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

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // enable cookies
    optionsSuccessStatus: 204,
    allowedHeaders: "Content-Type, Authorization",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/userdata", userdataRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message); // Broadcast the message to all users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  startSubscriptionChecker();
  server.listen(port, () => console.log(`Server running on port: ${port}`));
});
