import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  registerUser,
  logoutCurrentUser,
} from "../controllers/userController.js";

// Log to confirm this file is loaded
console.log("USERROUTES.JS LOADED - FIX_400_TOKEN -", new Date().toISOString());

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user and generate JWT
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    console.log("USERROUTES: LOGIN EXECUTED -", new Date().toISOString());

    const { email, password } = req.body;

    if (!email || !password) {
      console.error("USERROUTES: Missing email or password");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error("USERROUTES: User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("USERROUTES: Invalid password for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      console.error("USERROUTES: User banned:", user._id);
      return res.status(403).json({ message: "Account suspended" });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    console.log("USERROUTES: Token generated for user:", user._id.toString());

    res.cookie("auth_jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  })
);

// Logout user
router.post("/logout", logoutCurrentUser);

export default router;
