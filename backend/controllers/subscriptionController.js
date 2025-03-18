import Subscription from "../models/subscriptionModel.js";
import { verifyPayment } from "../paystack.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create a new subscription
export const createSubscription = asyncHandler(async (req, res) => {
  try {
    const { paymentReference, plan, amount, duration, paymentType } = req.body;

    console.log("Subscription request data:", req.body); // Debug input

    const payment = await verifyPayment(paymentReference);
    console.log("Payment verification result:", payment); // Debug result

    // Check Paystack response: status must be true and transaction status must be "success"
    if (!payment.status || payment.data?.status !== "success") {
      return res
        .status(400)
        .json({ message: payment.message || "Payment verification failed" });
    }

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingSubscription = await Subscription.findOne({
      user: user._id,
      plan,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: "You already have an active subscription for this plan",
      });
    }

    const subscription = new Subscription({
      user: user._id,
      email: user.email,
      name: user.name,
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
    console.log("Subscription created:", subscription); // Debug success
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get user's subscriptions
export const getMySubscriptions = asyncHandler(async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({
      startDate: -1,
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching user subscriptions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Cancel a subscription
export const cancelSubscription = asyncHandler(async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    subscription.status = "canceled";
    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    console.error("Error canceling subscription:", error.message);
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
