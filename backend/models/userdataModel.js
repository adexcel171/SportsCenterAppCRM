import mongoose from "mongoose";

const userdataSchema = mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String, // Assuming the number is a string based on your previous code
      required: true,
    },
    email: {
      type: String,
      required: false,// Adding unique constraint for email
     // Adding trim to remove leading/trailing whitespaces
    },
    amount: {
      type: Number,
      required: true,
      min: 0, // Adding minimum value constraint for amount
    },
    currency: {
      type: String,
      required: true,
      // enum: ["USD", "EUR", "GBP"], // Adding enum for currency options
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userdataSchema); // Use capitalization for the model name
export default UserData;
