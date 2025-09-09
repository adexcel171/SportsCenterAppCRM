import asyncHandler from "../middlewares/asyncHandler.js";
import UserData from "../models/userdataModel.js";
import { sendSubscriptionReminder } from "../utils/emailService.js";
import mongoose from "mongoose";

console.log("USERDATACONTROLLER.JS LOADED -", new Date().toISOString());

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const addUserData = asyncHandler(async (req, res) => {
  console.log(
    "ADDUSERDATA EXECUTED - User:",
    req.user?._id || "Unknown",
    "-",
    new Date().toISOString()
  );
  const {
    name,
    whatsappNumber,
    email,
    socialMedia,
    dateOfBirth,
    attendance,
    subscriptionEndDate,
    userId,
  } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "Name is required" });
  if (!whatsappNumber || whatsappNumber.trim() === "")
    return res.status(400).json({ error: "WhatsApp number is required" });
  if (!email || email.trim() === "")
    return res.status(400).json({ error: "Email is required" });
  if (!dateOfBirth || dateOfBirth.trim() === "")
    return res.status(400).json({ error: "Invalid date of birth" });

  const parsedDateOfBirth = new Date(dateOfBirth);
  if (isNaN(parsedDateOfBirth))
    return res.status(400).json({ error: "Invalid date of birth format" });

  let parsedSubscriptionEndDate;
  if (subscriptionEndDate) {
    parsedSubscriptionEndDate = new Date(subscriptionEndDate);
    if (isNaN(parsedSubscriptionEndDate))
      return res
        .status(400)
        .json({ error: "Invalid subscription end date format" });
  }

  let parsedAttendance = [];
  if (attendance && Array.isArray(attendance)) {
    parsedAttendance = attendance
      .map((date) => new Date(date))
      .filter((date) => !isNaN(date));
    if (parsedAttendance.length !== attendance.length)
      return res.status(400).json({ error: "Invalid attendance date format" });
  }

  if (!req.user?._id)
    return res.status(401).json({ error: "User not authenticated" });

  const effectiveUserId = userId || req.user._id.toString();
  if (!mongoose.Types.ObjectId.isValid(effectiveUserId)) {
    return res
      .status(400)
      .json({ error: `Invalid user ID: ${effectiveUserId}` });
  }
  if (!req.user.isAdmin && effectiveUserId !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Cannot create data for another user" });
  }

  try {
    const newUserdata = new UserData({
      userId: effectiveUserId,
      name,
      whatsappNumber,
      email,
      socialMedia: socialMedia || { facebook: "", twitter: "", instagram: "" },
      dateOfBirth: parsedDateOfBirth,
      attendance: parsedAttendance,
      subscriptionEndDate: parsedSubscriptionEndDate,
    });
    await newUserdata.save();
    res.status(201).json(newUserdata);
  } catch (error) {
    console.error("Database save error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to save user data" });
  }
});

const updateUserDataDetails = asyncHandler(async (req, res) => {
  console.log(
    "UPDATEUSERDATADETAILS EXECUTED - UserdataId:",
    req.params.userdataId,
    "-",
    new Date().toISOString()
  );
  const { userdataId } = req.params;
  const updates = req.body;

  if (
    !userdataId ||
    typeof userdataId !== "string" ||
    userdataId.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID: ${userdataId}` });
  }
  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID format: ${userdataId}` });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res
        .status(404)
        .json({ error: `User data not found for ID: ${userdataId}` });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: `Unauthorized: Cannot update user data for ID: ${userdataId}`,
      });
    }

    if (updates.name && updates.name.trim() === "")
      return res.status(400).json({ error: "Name cannot be empty" });
    if (updates.whatsappNumber && updates.whatsappNumber.trim() === "")
      return res.status(400).json({ error: "WhatsApp number cannot be empty" });
    if (updates.email && updates.email.trim() === "")
      return res.status(400).json({ error: "Email cannot be empty" });
    if (updates.dateOfBirth && updates.dateOfBirth.trim() === "")
      return res.status(400).json({ error: "Date of birth cannot be empty" });

    let parsedDateOfBirth;
    if (updates.dateOfBirth) {
      parsedDateOfBirth = new Date(updates.dateOfBirth);
      if (isNaN(parsedDateOfBirth))
        return res.status(400).json({ error: "Invalid date of birth format" });
      updates.dateOfBirth = parsedDateOfBirth;
    }

    if (updates.subscriptionEndDate) {
      const parsedDate = new Date(updates.subscriptionEndDate);
      if (isNaN(parsedDate))
        return res
          .status(400)
          .json({ error: "Invalid subscription end date format" });
      updates.subscriptionEndDate = parsedDate;
    }

    if (updates.attendance) {
      if (!Array.isArray(updates.attendance)) {
        updates.attendance = [];
      } else {
        const parsedAttendance = updates.attendance
          .map((date) => new Date(date))
          .filter((date) => !isNaN(date));
        if (parsedAttendance.length !== updates.attendance.length)
          return res
            .status(400)
            .json({ error: "Invalid attendance date format" });
        updates.attendance = parsedAttendance;
      }
    } else {
      updates.attendance = userData.attendance || [];
    }

    Object.assign(userData, updates);
    await userData.save();
    res.status(200).json(userData);
  } catch (error) {
    console.error("Update error:", error.message, error.stack);
    res
      .status(500)
      .json({ error: `Failed to update user data for ID: ${userdataId}` });
  }
});

const deleteUserData = asyncHandler(async (req, res) => {
  console.log(
    "DELETEUSERDATA EXECUTED - UserdataId:",
    req.params.userdataId,
    "-",
    new Date().toISOString()
  );
  const { userdataId } = req.params;

  if (
    !userdataId ||
    typeof userdataId !== "string" ||
    userdataId.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID: ${userdataId}` });
  }
  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID format: ${userdataId}` });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res
        .status(404)
        .json({ error: `User data not found for ID: ${userdataId}` });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: `Unauthorized: Cannot delete user data for ID: ${userdataId}`,
      });
    }

    await UserData.findByIdAndDelete(userdataId);
    res.status(200).json({ message: "User data deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error.message, error.stack);
    res
      .status(500)
      .json({ error: `Failed to delete user data for ID: ${userdataId}` });
  }
});

const fetchAllUserData = asyncHandler(async (req, res) => {
  console.log("FETCHALLUSERDATA EXECUTED -", new Date().toISOString());
  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }
  if (!req.user.isAdmin) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Admin access required" });
  }
  try {
    const allUserData = await UserData.find({}).lean();
    // Ensure attendance is an array and _id is a string
    const normalizedData = allUserData.map((user) => ({
      ...user,
      attendance: Array.isArray(user.attendance) ? user.attendance : [],
      _id: user._id?.toString() || null,
    }));
    res.status(200).json(normalizedData);
  } catch (error) {
    console.error("Database fetch error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch all user data" });
  }
});

const fetchUserDataById = asyncHandler(async (req, res) => {
  console.log(
    "FETCHUSERDATABYID EXECUTED - UserdataId:",
    req.params.userdataId,
    "-",
    new Date().toISOString()
  );
  const { userdataId } = req.params;

  if (
    !userdataId ||
    typeof userdataId !== "string" ||
    userdataId.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID: ${userdataId}` });
  }
  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID format: ${userdataId}` });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId).lean();
    if (!userData) {
      return res
        .status(404)
        .json({ error: `User data not found for ID: ${userdataId}` });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: `Unauthorized: Cannot access user data for ID: ${userdataId}`,
      });
    }

    // Ensure attendance is an array
    res.status(200).json({
      ...userData,
      attendance: Array.isArray(userData.attendance) ? userData.attendance : [],
      _id: userData._id?.toString(),
    });
  } catch (error) {
    console.error("Database fetch error:", error.message, error.stack);
    res
      .status(500)
      .json({ error: `Failed to fetch user data for ID: ${userdataId}` });
  }
});

const sendSubscriptionReminderToUser = asyncHandler(async (req, res) => {
  console.log(
    "SENDSUBSCRIPTIONREMINDERTOUSER EXECUTED - UserdataId:",
    req.params.userdataId,
    "-",
    new Date().toISOString()
  );
  const { userdataId } = req.params;

  if (
    !userdataId ||
    typeof userdataId !== "string" ||
    userdataId.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID: ${userdataId}` });
  }
  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res
      .status(400)
      .json({ error: `Invalid user data ID format: ${userdataId}` });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res
        .status(404)
        .json({ error: `User data not found for ID: ${userdataId}` });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        error: `Unauthorized: Cannot send reminder for user data ID: ${userdataId}`,
      });
    }

    const daysLeft = Math.ceil(
      (new Date(userData.subscriptionEndDate) - new Date()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysLeft > 3) {
      return res.status(400).json({
        error: `Subscription not expiring soon for ID: ${userdataId}`,
      });
    }

    await sendSubscriptionReminder(userData.email, userData.name, daysLeft);
    res.status(200).json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Reminder error:", error.message, error.stack);
    res
      .status(500)
      .json({ error: `Failed to send reminder for ID: ${userdataId}` });
  }
});

const getUserDataByUserId = asyncHandler(async (req, res) => {
  console.log(
    "GETUSERDATABYUSERID EXECUTED - UserId:",
    req.user._id,
    "-",
    new Date().toISOString()
  );
  const userId = req.user._id?.toString();

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: `Invalid user ID: ${userId}` });
  }

  try {
    const userData = await UserData.find({ userId }).lean();
    if (!userData || userData.length === 0) {
      console.log("GETUSERDATABYUSERID: No data found for userId:", userId);
      return res
        .status(404)
        .json({ error: "No user data found for this user" });
    }

    // Ensure attendance is an array and _id is a string
    const normalizedData = userData.map((user) => ({
      ...user,
      attendance: Array.isArray(user.attendance) ? user.attendance : [],
      _id: user._id?.toString() || null,
    }));
    res.status(200).json(normalizedData);
  } catch (error) {
    console.error(
      "GETUSERDATABYUSERID: Database fetch error:",
      error.message,
      error.stack
    );
    res
      .status(500)
      .json({ error: `Failed to fetch user data for user ID: ${userId}` });
  }
});

export {
  addUserData,
  updateUserDataDetails,
  deleteUserData,
  fetchAllUserData,
  fetchUserDataById,
  sendSubscriptionReminderToUser,
  getUserDataByUserId,
};
