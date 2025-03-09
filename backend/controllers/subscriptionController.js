// subscriptionController.js
import Subscription from "../models/subscriptionModel.js";
import { verifyPayment } from "../paystack.js";

export const createSubscription = async (req, res) => {
  try {
    console.log("Authenticated User in Controller:", req.user);

    const {
      paymentReference,
      plan,
      amount,
      duration,
      name,
      email,
      paymentType,
    } = req.body;

    // Verify payment with Paystack
    const payment = await verifyPayment(paymentReference);
    if (!payment.status) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Check if the user already has an active subscription for the same plan
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      plan,
      status: "active",
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: "User already has an active subscription for this plan",
      });
    }

    const subscription = new Subscription({
      user: req.user._id,
      plan,
      amount,
      duration,
      startDate: new Date(),
      endDate: calculateEndDate(new Date(), duration),
      status: "active",
      paymentReference,
      name, // Save name
      email, // Save email
      paymentType, // Save payment type
    });

    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Define getMySubscriptions
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({
      startDate: -1,
    });
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error("Error fetching user subscriptions:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Define cancelSubscription
export const cancelSubscription = async (req, res) => {
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
};

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
