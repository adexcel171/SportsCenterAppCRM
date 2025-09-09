import mongoose from "mongoose";

const userDataSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    socialMedia: {
      facebook: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    dateOfBirth: { type: Date, required: true },
    attendance: [{ type: Date }], // Changed to array of dates
    subscriptionEndDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("UserData", userDataSchema);
