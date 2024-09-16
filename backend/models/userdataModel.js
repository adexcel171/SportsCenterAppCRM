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
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", userdataSchema);
export default UserData;
