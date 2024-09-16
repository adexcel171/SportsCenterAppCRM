import asyncHandler from "../middlewares/asyncHandler.js";
import UserData from "../models/userdataModel.js"; // Capitalized model name for consistency

const addUserData = asyncHandler(async (req, res) => {
  try {
    const { name, number, credit, debit, note, date, currency } = req.fields;

    // Validation
    switch (true) {
      case !name || name.trim() === "":
        return res.json({ error: "Name is required" });
      case !number || number.trim() === "":
        return res.json({ error: "Number is required" });
      case !credit || credit.trim() === "":
        return res.json({ error: "credit is required" });
      case !debit || debit < 0:
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
    // Log the request body for debugging
    console.log("Request received:", req.body);

    // Extract the fields from the request body
    const { name, number, credit, debit, note, date, currency } = req.body;

    // Create an update object based on the fields that are present
    const updateFields = {};
    if (name) updateFields.name = name;
    if (number) updateFields.number = number;
    if (credit) updateFields.credit = credit;
    if (debit) updateFields.debit = debit;
    if (note) updateFields.note = note;
    if (date) updateFields.date = date;
    if (currency) updateFields.currency = currency;

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
