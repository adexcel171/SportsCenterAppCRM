import asyncHandler from "../middlewares/asyncHandler.js";
import UserData from "../models/userdataModel.js";
import { sendSubscriptionReminder } from "../utils/emailService.js";

// Add user data
const addUserData = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      number,
      email,
      credit,
      debit,
      note,
      date,
      subscription,
      subscriptionEndDate,
    } = req.fields;

    // Validation
    switch (true) {
      case !name || name.trim() === "":
        return res.json({ error: "Name is required" });
      case !number || number.trim() === "":
        return res.json({ error: "Number is required" });
      case !email || email.trim() === "":
        return res.json({ error: "Email is required" });
      case !credit || credit.trim() === "":
        return res.json({ error: "Credit is required" });
      case !debit || debit < 0:
        return res.json({ error: "Amount is required and must be positive" });
      case !note || note.trim() === "":
        return res.json({ error: "Notes are required" });
      case !date || date.trim() === "":
        return res.json({ error: "Date is required" });
      case !subscription || subscription.trim() === "":
        return res.json({ error: "Subscription type is required" });
      case !subscriptionEndDate || subscriptionEndDate.trim() === "":
        return res.json({ error: "Subscription end date is required" });
    }
    const parsedSubscriptionEndDate = new Date(subscriptionEndDate);

    // Check if the conversion was successful
    if (isNaN(parsedSubscriptionEndDate)) {
      return res.json({ error: "Invalid subscription end date format" });
    }

    const newUserdata = new UserData({ ...req.fields });
    await newUserdata.save();
    res.json(newUserdata);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Update user data
const updateUserDataDetails = asyncHandler(async (req, res) => {
  try {
    // Log the request body for debugging
    console.log("Request received:", req.body);

    // Extract the fields from the request body
    const {
      name,
      number,
      email,
      credit,
      debit,
      note,
      date,
      currency,
      subscription,
      subscriptionEndDate,
    } = req.body;

    // Create an update object based on the fields that are present
    const updateFields = {};
    if (name) updateFields.name = name;
    if (number) updateFields.number = number;
    if (email) updateFields.email = email;
    if (credit) updateFields.credit = credit;
    if (debit) updateFields.debit = debit;
    if (note) updateFields.note = note;
    if (date) updateFields.date = date;
    if (currency) updateFields.currency = currency;
    if (subscription) updateFields.subscription = subscription;
    if (subscriptionEndDate)
      updateFields.subscriptionEndDate = subscriptionEndDate;

    // If no fields are provided, respond with an error
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    // Update the user data based on the fields present
    const updatedUserData = await UserData.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    // Log the updated user data for debugging
    console.log("Updated user data:", updatedUserData);

    if (!updatedUserData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the updated user data
    res.json(updatedUserData);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Remove user data
const removeUserData = asyncHandler(async (req, res) => {
  try {
    const userData = await UserData.findById(req.params.id);

    if (!userData) {
      return res.status(404).json({ error: "User data not found" });
    }

    await UserData.findByIdAndDelete(req.params.id);
    res.json({ message: "User data removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error removing user data" });
  }
});

// Fetch user data with search and pagination
const fetchUserData = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await UserData.countDocuments({ ...keyword });
    const userDataList = await UserData.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      userDataList,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// Fetch user data by ID
const fetchUserDataById = asyncHandler(async (req, res) => {
  try {
    const userData = await UserData.findById(req.params.id);
    if (userData) {
      return res.json(userData);
    } else {
      res.status(404);
      throw new Error("UserData not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "UserData not found" });
  }
});

// Send subscription reminder
const sendSubscriptionReminderToUser = asyncHandler(async (req, res) => {
  try {
    const userData = await UserData.findById(req.params.id);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const success = await sendSubscriptionReminder(
      userData.email,
      userData.name,
      userData.subscriptionEndDate
    );

    if (success) {
      userData.lastReminderSent = new Date();
      await userData.save();
      res.json({ message: "Reminder sent successfully" });
    } else {
      throw new Error("Failed to send reminder");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send reminder" });
  }
});

// Fetch all user data
const fetchAllUserData = asyncHandler(async (req, res) => {
  try {
    const userDataList = await UserData.find({})
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(userDataList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addUserData,
  updateUserDataDetails,
  removeUserData,
  fetchUserData,
  fetchUserDataById,
  fetchAllUserData,
  sendSubscriptionReminderToUser,
};
