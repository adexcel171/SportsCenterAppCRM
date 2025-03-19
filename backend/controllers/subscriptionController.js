import mongoose from "mongoose";
import Subscription from "../models/subscriptionModel.js";
import { verifyPayment } from "../paystack.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create a new subscription
export const createSubscription = asyncHandler(async (req, res) => {
  try {
    const { paymentReference, plan, amount, duration, paymentType } = req.body;

    console.log("Subscription request data:", req.body);

    // Validate required fields
    if (!paymentReference || !plan || !amount || !duration || !paymentType) {
      return res.status(400).json({
        message: "Missing required fields",
        missing: {
          paymentReference: !paymentReference,
          plan: !plan,
          amount: !amount,
          duration: !duration,
          paymentType: !paymentType,
        },
      });
    }

    // Validate field types
    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }
    if (!["week", "month", "year"].includes(duration)) {
      return res.status(400).json({
        message: "Invalid duration. Must be 'week', 'month', or 'year'",
      });
    }

    // Verify payment with Paystack
    const payment = await verifyPayment(paymentReference);
    console.log("Payment verification result:", payment);

    if (!payment || !payment.status || payment.data?.status !== "success") {
      return res.status(400).json({
        message: payment?.message || "Payment verification failed",
        paymentDetails: payment,
      });
    }

    const user = req.user;
    if (!user || !user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check for existing active subscription
    const existingSubscription = await Subscription.findOne({
      user: user._id,
      plan,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: "You already have an active subscription for this plan",
        existingSubscriptionId: existingSubscription._id,
      });
    }

    // Create new subscription with fallback values
    const subscription = new Subscription({
      user: user._id,
      email: user.email || "unknown@example.com", // Fallback if email is missing
      name: user.name || "Unknown User", // Fallback if name is missing
      plan,
      amount,
      duration,
      startDate: new Date(),
      endDate: calculateEndDate(new Date(), duration),
      status: "active",
      paymentReference,
      paymentType,
    });

    await subscription.save();
    console.log("Subscription created:", subscription);
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error.message, error.stack);
    res.status(400).json({
      message: error.message || "Failed to create subscription",
      errorDetails: error.stack,
    });
  }
});

// Get user's subscriptions
export const getMySubscriptions = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const subscriptions = await Subscription.find({ user: req.user._id }).sort({
      startDate: -1,
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(
      "Error fetching user subscriptions:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel a subscription
export const cancelSubscription = asyncHandler(async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const subscriptionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      return res.status(400).json({ message: "Invalid subscription ID" });
    }

    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Use updateOne to only modify the status field
    const updatedSubscription = await Subscription.updateOne(
      { _id: subscriptionId },
      { $set: { status: "canceled" } }
    );

    if (updatedSubscription.nModified === 0) {
      return res.status(400).json({ message: "Failed to cancel subscription" });
    }

    // Fetch the updated document to return it
    const result = await Subscription.findById(subscriptionId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error canceling subscription:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Helper function to calculate subscription end date
const calculateEndDate = (startDate, duration) => {
  const date = new Date(startDate);
  switch (duration) {
    case "week":
      date.setDate(date.getDate() + 7);
      break;
    case "month":
      date.setMonth(date.getMonth() + 1);
      break;
    case "year":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      throw new Error("Invalid duration");
  }
  return date;
};

export default {
  createSubscription,
  getMySubscriptions,
  cancelSubscription,
};
