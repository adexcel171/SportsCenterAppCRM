import mongoose from "mongoose";

const userdataSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
      min: 0,
    },
    debit: {
      type: Number,
      required: true,
      min: 0,
    },
    note: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    subscriptionEndDate: {
      type: Date,
      required: true,
    },
    lastReminderSent: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Add a method to check if subscription is expiring soon
userdataSchema.methods.isSubscriptionExpiringSoon = function () {
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (this.subscriptionEndDate - today) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 7; // Return true if 7 or fewer days remaining
};

const UserData = mongoose.model("UserData", userdataSchema);
export default UserData;
