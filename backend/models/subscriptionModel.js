import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, required: true },
    amount: { type: Number, required: true },
    duration: { type: String, required: true },
    startDate: { type: Date, default: Date.now }, // Automatically set to current date
    endDate: { type: Date }, // Calculated based on duration
    status: { type: String, enum: ["active", "expired"], default: "active" },
    paymentReference: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtual field to calculate endDate based on duration
subscriptionSchema.virtual("calculateEndDate").get(function () {
  const duration = this.duration;
  const startDate = this.startDate || new Date();

  if (duration === "/month") {
    return new Date(startDate.setMonth(startDate.getMonth() + 1));
  }
  // Add more conditions for other durations if needed
  return startDate;
});

// Pre-save hook to set endDate
subscriptionSchema.pre("save", function (next) {
  if (!this.endDate) {
    this.endDate = this.calculateEndDate;
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
