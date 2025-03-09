// authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  console.log("Incoming Headers:", req.headers); // Debugging

  let token =
    req.cookies?.jwt ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null);

  console.log("Extracted Token:", token); // Debugging

  if (!token) {
    console.error("No token found in request");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.error("User not found for token:", decoded.userId);
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    console.log("Authenticated User:", user); // Debugging
    req.user = user; // Attach user to the request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export { authenticate, authorizeAdmin };
