import asyncHandler from "../middlewares/asyncHandler.js";
import UserData from "../models/userdataModel.js"; // Capitalized model name for consistency

const addUserData = asyncHandler(async (req, res) => {
  try {
    const { day, date, name, number, email, amount, currency } = req.fields;

    // Validation
    switch (true) {
      case !day:
        return res.json({ error: "Day is required" });
      case !date:
        return res.json({ error: "Date is required" });
      case !name:
        return res.json({ error: "Name is required" });
      case !number:
        return res.json({ error: "Number is required" });
      case !email:
        return res.json({ error: "Email is required" });
      case !amount:
        return res.json({ error: "Amount is required" });
      case !currency:
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
    const { day, date, name, number, email, amount, currency } = req.fields;

    // Validation
    if (!day || day.trim() === "") {
      return res.json({ error: "Day is required" });
    }
    if (!date || date.trim() === "") {
      return res.json({ error: "Date is required" });
    }
    if (!name || name.trim() === "") {
      return res.json({ error: "Name is required" });
    }
    if (!number || number.trim() === "") {
      return res.json({ error: "Number is required" });
    }
    if (!email || email.trim() === "") {
      return res.json({ error: "Email is required" });
    }
    if (!amount || amount.trim() === "") {
      return res.json({ error: "Amount is required" });
    }
    if (!currency || currency.trim() === "") {
      return res.json({ error: "Currency is required" });
    }

    const updatedUserData = await UserData.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );

    res.json(updatedUserData);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
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
