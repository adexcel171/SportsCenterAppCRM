import mongoose from "mongoose";
import Subscription from "../models/subscriptionModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

console.log("SUBSCRIPTIONCONTROLLER.JS LOADED -", new Date().toISOString());

const createSubscription = asyncHandler(async (req, res) => {
  console.log(
    "CREATESUBSCRIPTION EXECUTED - User:",
    req.user?._id,
    "Body:",
    req.body,
    "-",
    new Date().toISOString()
  );
  const {
    plan,
    amount,
    duration,
    paymentReference,
    paymentType,
    startDate,
    endDate,
  } = req.body;

  if (
    !plan ||
    !amount ||
    !duration ||
    !paymentReference ||
    !paymentType ||
    !startDate ||
    !endDate
  ) {
    return res.status(400).json({
      message: "Missing required fields",
      missing: {
        plan: !plan,
        amount: !amount,
        duration: !duration,
        paymentReference: !paymentReference,
        paymentType: !paymentType,
        startDate: !startDate,
        endDate: !endDate,
      },
    });
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);
  if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (!req.user?._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const existingSubscription = await Subscription.findOne({
    user: req.user._id,
    plan,
    status: "active",
  });

  if (existingSubscription) {
    return res.status(400).json({
      message: "You already have an active subscription for this plan",
      existingSubscriptionId: existingSubscription._id,
    });
  }

  const subscription = new Subscription({
    user: req.user._id,
    email: req.user.email || "unknown@example.com",
    name: req.user.name || "Unknown User",
    plan,
    amount,
    duration,
    paymentReference,
    paymentType,
    startDate: parsedStartDate,
    endDate: parsedEndDate,
    status: "active",
  });

  await subscription.save();
  res.status(201).json(subscription);
});

const getAllSubscriptions = asyncHandler(async (req, res) => {
  console.log(
    "GETALLSUBSCRIPTIONS EXECUTED - User:",
    req.user?._id,
    "-",
    new Date().toISOString()
  );
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  const subscriptions = await Subscription.find({})
    .populate("user", "name email")
    .sort({ startDate: -1 });
  res.status(200).json(subscriptions);
});

const getMySubscriptions = asyncHandler(async (req, res) => {
  console.log(
    "GETMYSUBSCRIPTIONS EXECUTED - User:",
    req.user?._id,
    "-",
    new Date().toISOString()
  );
  if (!req.user?._id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const subscriptions = await Subscription.find({ user: req.user._id }).sort({
    startDate: -1,
  });
  res.status(200).json(subscriptions);
});

const cancelSubscription = asyncHandler(async (req, res) => {
  console.log(
    "CANCELSUBSCRIPTION EXECUTED - SubscriptionId:",
    req.params.id,
    "-",
    new Date().toISOString()
  );
  if (!req.user?._id) {
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

  subscription.status = "canceled";
  await subscription.save();
  res.status(200).json(subscription);
});

export {
  createSubscription,
  getAllSubscriptions,
  getMySubscriptions,
  cancelSubscription,
};
