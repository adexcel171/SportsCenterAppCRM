import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addUserData,
  updateUserDataDetails,
  removeUserData,
  fetchUserData,
  fetchUserDataById,
  fetchAllUserData,
  sendSubscriptionReminderToUser,
} from "../controllers/userdataController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Base routes
router.route("/").get(fetchUserData).post(formidable(), addUserData);

// Get all user data
// router.route("/all").get(authenticate, authorizeAdmin, fetchAllUserData);
router.route("/alluserdata").get(fetchAllUserData, authenticate);

// Individual user data routes
router
  .route("/:id")
  .get(fetchUserDataById)
  .put(updateUserDataDetails)
  .delete(removeUserData, authenticate, authorizeAdmin);

// Subscription reminder route
router.route("/:id/remind").post(authenticate, sendSubscriptionReminderToUser);

export default router;
