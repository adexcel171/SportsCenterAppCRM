// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";
import mongoose from "mongoose";

console.log(
  "AUTHMIDDLEWARE.JS LOADED - FIX_400_TOKEN -",
  new Date().toISOString()
);

const authenticate = asyncHandler(async (req, res, next) => {
  console.log(
    "AUTHMIDDLEWARE: EXECUTED - Headers:",
    req.headers.authorization
      ? "Authorization present"
      : "No Authorization header",
    "-",
    new Date().toISOString()
  );

  const token = req.headers.authorization?.startsWith("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : null;

  console.log(
    "AUTHMIDDLEWARE: Extracted Token:",
    token ? "Token present" : "No token"
  );

  if (!token) {
    console.error("AUTHMIDDLEWARE: No token provided");
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    console.log("AUTHMIDDLEWARE: Verifying token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AUTHMIDDLEWARE: Decoded Token:", decoded);

    if (!decoded.userId) {
      console.error("AUTHMIDDLEWARE: No userId in decoded token");
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }

    // Validate userId as MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      console.error("AUTHMIDDLEWARE: Invalid userId format:", decoded.userId);
      return res.status(401).json({ error: "Not authorized, invalid user ID" });
    }

    // Fetch user and convert _id to ObjectId
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.error("AUTHMIDDLEWARE: User not found for ID:", decoded.userId);
      return res.status(401).json({ error: "Not authorized, user not found" });
    }

    if (user.isBanned) {
      console.error("AUTHMIDDLEWARE: User is banned:", decoded.userId);
      return res.status(403).json({ error: "Account suspended" });
    }

    // Set req.user with _id as ObjectId
    req.user = {
      _id: new mongoose.Types.ObjectId(decoded.userId),
      email: user.email,
      isAdmin: user.isAdmin,
    };
    console.log("AUTHMIDDLEWARE: User set:", req.user._id.toString());
    next();
  } catch (error) {
    console.error(
      "AUTHMIDDLEWARE: Token verification error:",
      error.message,
      error.stack
    );
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
});

const authorizeAdmin = asyncHandler(async (req, res, next) => {
  console.log(
    "AUTHMIDDLEWARE: authorizeAdmin EXECUTED - User:",
    req.user?._id || "Unknown",
    "-",
    new Date().toISOString()
  );

  if (req.user && req.user.isAdmin) {
    next();
  } else {
    console.error(
      "AUTHMIDDLEWARE: Admin authorization failed for user:",
      req.user?._id
    );
    return res.status(403).json({ error: "Not authorized as admin" });
  }
});

export { authenticate, authorizeAdmin };
