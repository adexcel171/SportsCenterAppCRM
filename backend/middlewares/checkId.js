// src/middlewares/checkId.js
import { ObjectId } from "mongodb";
import asyncHandler from "./asyncHandler.js";

// Log to confirm file is loaded
console.log("CHECKID.JS LOADED - FIX_400_MYDATA -", new Date().toISOString());

// Middleware to validate MongoDB ObjectId
const checkId = asyncHandler(async (req, res, next) => {
  const { userdataId } = req.params;

  // Skip validation for "mydata" route ✅
  if (userdataId && userdataId !== "mydata") {
    if (!ObjectId.isValid(userdataId)) {
      return res.status(400).json({ error: "Invalid user data ID" });
    }
  }
  next(); // Proceed if no ID or if "mydata"
});

export default checkId;
