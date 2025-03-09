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

// Reuse existing getMySubscriptions and cancelSubscription as they are
export { getMySubscriptions, cancelSubscription };

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
