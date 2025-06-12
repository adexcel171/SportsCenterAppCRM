import mongoose from "mongoose";

// Log to confirm this file is loaded
console.log(
  "SUBSCRIPTIONMODEL.JS LOADED - FIX_500_TOKEN -",
  new Date().toISOString()
);

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "expired", "canceled"],
    default: "active",
  },
  paymentReference: {
    type: String,
    required: false, // Made optional for bypass logic
  },
  paymentType: {
    type: String,
    required: false, // Made optional for bypass logic
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
