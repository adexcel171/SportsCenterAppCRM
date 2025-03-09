import express from "express";
import {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import Subscription from "../models/subscriptionModel.js";

const router = express.Router();

// Create a new subscription (authenticated users only)
router.route("/").post(authenticate, createSubscription);

// Get logged-in user's subscriptions (authenticated users only)
router.route("/my-subscriptions").get(authenticate, getMySubscriptions);

// Get all active subscriptions (no authentication required)
router.route("/all").get(async (req, res) => {
  try {
    const activeSubscriptions = await Subscription.find({ status: "active" })
      .populate("user", "name email")
      .sort({ startDate: -1 });
    res.status(200).json(activeSubscriptions);
  } catch (error) {
    console.error("Error fetching active subscriptions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel a subscription (authenticated users only)
router.route("/cancel/:id").put(authenticate, cancelSubscription);

export default router;
