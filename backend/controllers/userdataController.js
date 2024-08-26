import asyncHandler from "../middlewares/asyncHandler.js";
import UserData from "../models/userdataModel.js"; // Capitalized model name for consistency

const addUserData = asyncHandler(async (req, res) => {
  try {
    const { name, number, email, amount, note, date, currency } = req.fields;

    // Validation
    switch (true) {
      case !name || name.trim() === "":
        return res.json({ error: "Name is required" });
      case !number || number.trim() === "":
        return res.json({ error: "Number is required" });
      case !email || email.trim() === "":
        return res.json({ error: "Email is required" });
      case !amount || amount <= 0:
        return res.json({ error: "Amount is required and must be positive" });
      case !note || note.trim() === "":
        return res.json({ error: "Notes are required" });
      case !date || date.trim() === "":
        return res.json({ error: "Date is required" });
      case !currency || currency.trim() === "":
        return res.json({ error: "Currency is required" });
    }

    const newUserdata = new UserData({ ...req.fields });
    await newUserdata.save();
    res.json(newUserdata);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
const updateUserDataDetails = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log request body
    const { name, number, email, amount, note, date, currency } = req.body;

    const errors = [];
    if (!date || date.trim() === "") errors.push("Date is required");
    if (!name || name.trim() === "") errors.push("Name is required");
    if (!number || number.trim() === "") errors.push("Number is required");
    if (!email || email.trim() === "") errors.push("Email is required");
    if (!amount || amount.trim() === "") errors.push("Amount is required");
    if (!currency || currency.trim() === "") errors.push("Currency is required");
    if (!note || note.trim() === "") errors.push("Note is required");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const updatedUserData = await UserData.findByIdAndUpdate(
      req.params.id,
      { name, number, email, amount, note, date, currency },
      { new: true }
    );

    console.log("Updated user data:", updatedUserData); // Log updated data

    if (!updatedUserData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUserData);
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ error: error.message });
  }
});


const removeUserData = asyncHandler(async (req, res) => {
  try {
    const deletedUserData = await UserData.findByIdAndDelete(req.params.id);
    res.json(deletedUserData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchUserData = asyncHandler(async (req, res) => {
  try {
    const pageSize = 10;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await UserData.countDocuments({ ...keyword });
    const userDataList = await UserData.find({ ...keyword }).limit(pageSize);

    res.json({
      userDataList,
      page: 2,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

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
};
