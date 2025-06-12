import express from "express";
import {
  addUserData,
  updateUserDataDetails,
  deleteUserData,
  fetchAllUserData,
  fetchUserDataById,
  sendSubscriptionReminderToUser,
  getUserDataByUserId,
} from "../controllers/userdataController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

console.log("USERDATAROUTES.JS LOADED -", new Date().toISOString());

const router = express.Router();

// Create new user data
router.post("/", authenticate, (req, res, next) => {
  console.log("ROUTE: POST /api/userdata EXECUTED -", new Date().toISOString());
  addUserData(req, res, next);
});

// Get user data by user ID
router.get("/mydata", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: GET /api/userdata/mydata EXECUTED -",
    new Date().toISOString()
  );
  getUserDataByUserId(req, res, next);
});

// Get all user data (admin only)
router.get("/", authenticate, authorizeAdmin, (req, res, next) => {
  console.log("ROUTE: GET /api/userdata EXECUTED -", new Date().toISOString());
  fetchAllUserData(req, res, next);
});

// Get user data by ID
router.get("/:userdataId", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: GET /api/userdata/:userdataId EXECUTED -",
    new Date().toISOString()
  );
  fetchUserDataById(req, res, next);
});

// Update user data
router.put("/:userdataId", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: PUT /api/userdata/:userdataId EXECUTED -",
    new Date().toISOString()
  );
  updateUserDataDetails(req, res, next);
});

// Delete user data
router.delete("/:userdataId", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: DELETE /api/userdata/:userdataId EXECUTED -",
    new Date().toISOString()
  );
  deleteUserData(req, res, next);
});

// Send subscription reminder
router.post("/reminder/:userdataId", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: POST /api/userdata/reminder/:userdataId EXECUTED -",
    new Date().toISOString()
  );
  sendSubscriptionReminderToUser(req, res, next);
});

export default router;
