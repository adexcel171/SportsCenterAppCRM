import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import userdataRoutes from "./routes/userdataRoutes.js";
import { startSubscriptionChecker } from "./utils/subscriptionChecker.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/userdata", userdataRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start subscription checker
startSubscriptionChecker();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
