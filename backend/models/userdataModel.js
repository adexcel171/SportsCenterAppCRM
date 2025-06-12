import mongoose from "mongoose";

const userDataSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    credit: { type: Number, required: true },
    debit: { type: Number, required: true },
    note: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    subscription: { type: String, required: true },
    subscriptionEndDate: { type: Date, required: true },
    height: { type: Number, required: true },
    bodyType: { type: String, required: true },
    fitnessGoals: { type: String, required: true },
    activityLevel: { type: String, required: true },
    dietaryPreferences: { type: String, required: true },
    preferredSports: { type: String, required: true },
    gender: { type: String, required: true },
    recommendations: {
      workoutPlan: { type: String },
      dietPlan: { type: String },
      exerciseTypes: { type: String },
      goalActions: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserData", userDataSchema);
