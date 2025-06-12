// src/controllers/userdataController.js
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
    number,
    email,
    credit,
    debit,
    note,
    dateOfBirth,
    subscription,
    subscriptionEndDate,
    height,
    bodyType,
    fitnessGoals,
    activityLevel,
    dietaryPreferences,
    preferredSports,
    gender,
    userId,
  } = req.body;

  if (!name || name.trim() === "")
    return res.status(400).json({ error: "Name is required" });
  if (!number || number.trim() === "")
    return res.status(400).json({ error: "Number is required" });
  if (!email || email.trim() === "")
    return res.status(400).json({ error: "Email is required" });
  if (credit == null || credit < 0)
    return res
      .status(400)
      .json({ error: "Weight is required and must be non-negative" });
  if (debit == null || debit < 0)
    return res
      .status(400)
      .json({ error: "Debit is required and must be non-negative" });
  if (!note || note.trim() === "")
    return res.status(400).json({ error: "Notes are required" });
  if (!dateOfBirth || dateOfBirth.trim() === "")
    return res.status(400).json({ error: "Invalid Date of birth" });
  if (!subscription || subscription.trim() === "")
    return res
      .status(400)
      .json({ error: "Invalid Subscription type is required" });
  if (!subscriptionEndDate || subscriptionEndDate.trim() === "")
    return res.status(400).json({ error: "Subscription end date is required" });
  if (!height || height <= 0)
    return res.status(400).json({ error: "Height must be positive" });
  if (!bodyType)
    return res.status(400).json({ error: "Body type is required" });
  if (!fitnessGoals)
    return res.status(400).json({ error: "Goals are required" });
  if (!activityLevel)
    return res.status(400).json({ error: "Activity level is required" });
  if (!dietaryPreferences)
    return res.status(400).json({ error: "Dietary preferences are required" });
  if (!preferredSports)
    return res.status(400).json({ error: "Sports preferences are required" });
  if (!gender) return res.status(400).json({ error: "Gender is required" });

  const parsedSubscriptionEndDate = new Date(subscriptionEndDate);
  if (isNaN(parsedSubscriptionEndDate))
    return res
      .status(400)
      .json({ error: "Invalid subscription end date format" });

  const parsedDateOfBirth = new Date(dateOfBirth);
  if (isNaN(parsedDateOfBirth))
    return res.status(400).json({ error: "Invalid date of birth format" });

  if (!req.user?._id)
    return res.status(401).json({ error: "User not authenticated" });

  const effectiveUserId = userId || req.user._id.toString();
  if (!req.user.isAdmin && effectiveUserId !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Cannot create data for another user" });
  }

  const age = calculateAge(parsedDateOfBirth);
  const recommendations = generateFallbackRecommendations({
    age,
    gender,
    credit,
    height,
    bodyType,
    fitnessGoals,
    activityLevel,
    dietaryPreferences,
    preferredSports,
    note,
  });

  try {
    const newUserdata = new UserData({
      userId: effectiveUserId,
      name,
      number,
      email,
      credit,
      debit,
      note,
      dateOfBirth: parsedDateOfBirth,
      subscription,
      subscriptionEndDate: parsedSubscriptionEndDate,
      height,
      bodyType,
      fitnessGoals,
      activityLevel,
      dietaryPreferences,
      preferredSports,
      gender,
      recommendations,
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

  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res.status(400).json({ error: "Invalid user data ID" });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res.status(404).json({ error: "User data not found" });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Cannot update another user's data" });
    }

    if (updates.name && updates.name.trim() === "")
      return res.status(400).json({ error: "Name cannot be empty" });
    if (updates.number && updates.number.trim() === "")
      return res.status(400).json({ error: "Number cannot be empty" });
    if (updates.email && updates.email.trim() === "")
      return res.status(400).json({ error: "Email cannot be empty" });
    if (updates.credit != null && updates.credit < 0)
      return res.status(400).json({ error: "Weight must be non-negative" });
    if (updates.debit != null && updates.debit < 0)
      return res.status(400).json({ error: "Debit must be non-negative" });
    if (updates.note && updates.note.trim() === "")
      return res.status(400).json({ error: "Notes cannot be empty" });
    if (updates.dateOfBirth && updates.dateOfBirth.trim() === "")
      return res.status(400).json({ error: "Date of birth cannot be empty" });
    if (updates.subscription && updates.subscription.trim() === "")
      return res
        .status(400)
        .json({ error: "Subscription type cannot be empty" });
    if (
      updates.subscriptionEndDate &&
      updates.subscriptionEndDate.trim() === ""
    )
      return res
        .status(400)
        .json({ error: "Subscription end date cannot be empty" });
    if (updates.height != null && updates.height <= 0)
      return res.status(400).json({ error: "Height must be positive" });
    if (updates.gender && updates.gender.trim() === "")
      return res.status(400).json({ error: "Gender cannot be empty" });

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

    let recommendations = userData.recommendations;
    if (
      updates.credit ||
      updates.height ||
      updates.bodyType ||
      updates.fitnessGoals ||
      updates.activityLevel ||
      updates.dietaryPreferences ||
      updates.preferredSports ||
      updates.dateOfBirth ||
      updates.gender ||
      updates.note
    ) {
      const age = updates.dateOfBirth
        ? calculateAge(updates.dateOfBirth)
        : calculateAge(userData.dateOfBirth);
      recommendations = generateFallbackRecommendations({
        age,
        gender: updates.gender || userData.gender,
        credit: updates.credit || userData.credit,
        height: updates.height || userData.height,
        bodyType: updates.bodyType || userData.bodyType,
        fitnessGoals: updates.fitnessGoals || userData.fitnessGoals,
        activityLevel: updates.activityLevel || userData.activityLevel,
        dietaryPreferences:
          updates.dietaryPreferences || userData.dietaryPreferences,
        preferredSports: updates.preferredSports || userData.preferredSports,
        note: updates.note || userData.note,
      });
    }

    Object.assign(userData, updates, { recommendations });
    await userData.save();
    res.json(userData);
  } catch (error) {
    console.error("Database update error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to update user data" });
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

  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res.status(400).json({ error: "Invalid user data ID" });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res.status(404).json({ error: "User data not found" });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Cannot delete another user's data" });
    }

    await UserData.deleteOne({ _id: userdataId });
    res.json({ message: "User data deleted successfully" });
  } catch (error) {
    console.error("Database delete error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to delete user data" });
  }
});

const fetchAllUserData = asyncHandler(async (req, res) => {
  console.log(
    "FETCHALLUSERDATA EXECUTED - User:",
    req.user?._id || "Unknown",
    "-",
    new Date().toISOString()
  );

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
    const userData = await UserData.find({});
    res.json(userData);
  } catch (error) {
    console.error("Database fetch error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to fetch user data" });
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

  // Validate user is authenticated
  if (!req.user?._id) {
    console.error("FETCHUSERDATABYID: No authenticated user");
    return res.status(401).json({ error: "Unauthorized: Please log in" });
  }

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    console.error("FETCHUSERDATABYID: Invalid ID format:", userdataId);
    return res.status(400).json({
      error: "Invalid request format",
      details: "Please provide a valid user data ID",
    });
  }

  try {
    // Find user data
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      console.error("FETCHUSERDATABYID: Data not found for ID:", userdataId);
      return res.status(404).json({
        error: "Data not found",
        solution: "Check if the ID is correct",
      });
    }

    // Check authorization
    const isOwner = userData.userId.toString() === req.user._id.toString();
    if (!req.user.isAdmin && !isOwner) {
      console.error(
        "FETCHUSERDATABYID: Unauthorized access attempt by user:",
        req.user._id
      );
      return res.status(403).json({
        error: "Access denied",
        details: "You can only view your own data",
      });
    }

    // Successful response
    console.log(
      "FETCHUSERDATABYID: Successfully fetched data for:",
      userdataId
    );
    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error(
      "FETCHUSERDATABYID: Database error:",
      error.message,
      error.stack
    );
    res.status(500).json({
      error: "Server error",
      details: "Failed to fetch data. Please try again later.",
    });
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

  if (!mongoose.Types.ObjectId.isValid(userdataId)) {
    return res.status(400).json({ error: "Invalid user data ID" });
  }

  if (!req.user?._id) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  try {
    const userData = await UserData.findById(userdataId);
    if (!userData) {
      return res.status(404).json({ error: "User data not found" });
    }

    if (
      !req.user.isAdmin &&
      userData.userId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Cannot send reminder for another user" });
    }

    const daysUntilExpiration = Math.ceil(
      (new Date(userData.subscriptionEndDate) - new Date()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysUntilExpiration > 3) {
      return res
        .status(400)
        .json({ message: "Subscription not expiring soon" });
    }

    await sendSubscriptionReminder(
      userData.email,
      userData.name,
      daysUntilExpiration
    );
    res.json({ message: "Subscription reminder sent successfully" });
  } catch (error) {
    console.error("Subscription reminder error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to send subscription reminder" });
  }
});

const getUserDataByUserId = asyncHandler(async (req, res) => {
  console.log(
    "GETUSERDATABYUSERID EXECUTED - UserId:",
    req.user?._id || "Unknown",
    "- Headers:",
    req.headers.authorization || "No Authorization header",
    "-",
    new Date().toISOString()
  );

  if (!req.user || !req.user._id) {
    console.error("GETUSERDATABYUSERID: No user ID found in req.user");
    return res
      .status(401)
      .json({ error: "Unauthorized: User not authenticated" });
  }

  const userId = req.user._id;
  console.log(
    "GETUSERDATABYUSERID: UserId type:",
    typeof userId,
    "- Value:",
    userId
  );

  try {
    console.log("GETUSERDATABYUSERID: Querying UserData for userId:", userId);
    const userData = await UserData.find({ userId });
    console.log(
      "GETUSERDATABYUSERID: Query result:",
      userData.length,
      "records found"
    );

    if (!userData || userData.length === 0) {
      console.warn(
        "GETUSERDATABYUSERID: No user data found for userId:",
        userId
      );
      return res
        .status(404)
        .json({ error: "No user data found for this user" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error(
      "GETUSERDATABYUSERID: Database fetch error:",
      error.message,
      error.stack
    );
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

const generateFallbackRecommendations = ({
  age,
  gender,
  credit,
  height,
  bodyType,
  fitnessGoals,
  activityLevel,
  dietaryPreferences,
  preferredSports,
  note,
}) => {
  console.log(
    "GENERATEFALLBACKRECOMMENDATIONS EXECUTED -",
    new Date().toISOString()
  );
  let workoutPlan = "";
  let dietPlan = "";
  let exerciseTypes = "Cardio, Strength, Flexibility";
  let goalActions = [];

  const isSenior = age >= 60;
  const isYoung = age < 18;
  const genderModifier =
    gender === "Female"
      ? "Consider lower-impact exercises if pregnant or post-partum. "
      : "";

  if (fitnessGoals === "Weight Loss") {
    workoutPlan = isSenior
      ? "Low-impact cardio 4 days/week (20-30 min, e.g., brisk walking, light traditional dance like Bata), flexibility exercises 2 days/week (e.g., stretching, yoga)."
      : isYoung
      ? "Moderate cardio 4 days/week (20-30 min, e.g., running, football), bodyweight strength training 2 days/week (e.g., squats, push-ups)."
      : `Cardio 5 days/week (30-45 min, e.g., jogging, skipping rope, or traditional dance like Atilogwu), strength training 2 days/week (bodyweight exercises like squats, lunges). ${genderModifier}`;
    exerciseTypes = isSenior
      ? "Cardio, Balance, Flexibility"
      : "Cardio, HIIT, Flexibility";
    dietPlan =
      dietaryPreferences === "Nigerian Traditional"
        ? `Low-calorie meals with egusi soup (no palm oil), boiled yam, vegetable stew, and grilled fish. ${
            isSenior ? "Include calcium-rich foods like okra." : ""
          }`
        : dietaryPreferences === "Vegetarian"
        ? `Vegetable-based soups (e.g., okra, spinach stew), moi moi, and boiled plantain. ${
            isYoung ? "Ensure adequate protein with beans." : ""
          }`
        : dietaryPreferences === "Vegan"
        ? "Plant-based meals with beans, vegetable stew, and rice."
        : `Lean proteins (e.g., chicken, fish), vegetables, and moderate portions of jollof rice. ${
            note.includes("diabetes")
              ? "Limit high-sugar foods like puff-puff."
              : ""
          }`;
    goalActions = [
      `Aim for a ${
        isSenior ? "300-500" : "500-750"
      } kcal daily deficit through diet and exercise.`,
      "Join a local football club or dance group for fun cardio sessions.",
      `Walk or jog in a nearby park or community field ${
        isSenior ? "3-4" : "4-5"
      } days/week.`,
      `Use affordable staples like beans or lentils for protein-rich meals. ${
        note.includes("budget") ? "Focus on market-fresh vegetables." : ""
      }`,
    ];
  } else if (fitnessGoals === "Muscle Gain") {
    workoutPlan = isSenior
      ? "Light strength training 3 days/week (e.g., resistance bands, light weights), focus on functional movements; include low-impact sports."
      : isYoung
      ? "Bodyweight strength training 4 days/week (e.g., push-ups, pull-ups), include sports like wrestling."
      : `Strength training 5 days/week (e.g., push-ups, squats, resistance bands), focus on compound movements; include sports like boxing or wrestling. ${genderModifier}`;
    exerciseTypes = isSenior
      ? "Strength, Functional, Flexibility"
      : "Strength, Hypertrophy, Functional";
    dietPlan =
      dietaryPreferences === "Nigerian Traditional"
        ? `High-protein meals with pounded yam and egusi stew, grilled chicken, and boiled eggs. ${
            isSenior ? "Include bone-healthy foods like fish." : ""
          }`
        : dietaryPreferences === "Vegetarian"
        ? "Plant-based proteins like beans, moi moi, and groundnut soup with rice."
        : dietaryPreferences === "Vegan"
        ? "Plant-based proteins like beans, groundnut soup, and tofu with rice."
        : `High-protein meals with beef, fish, moi moi, and complex carbs like yam. ${
            note.includes("hypertension") ? "Reduce salt in stews." : ""
          }`;
    goalActions = [
      `Increase protein intake to ${
        isYoung ? "1.2-1.8" : "1.6-2.2"
      }g/kg body weight daily.`,
      "Train with progressive overload using bodyweight or affordable gym equipment.",
      `Rest 48 hours between muscle groups for recovery. ${
        isSenior ? "Avoid overexertion." : ""
      }`,
      "Participate in wrestling or boxing clubs, popular in Nigeria, for strength.",
    ];
  } else if (fitnessGoals === "Endurance & Stamina") {
    workoutPlan = isSenior
      ? "Long-distance walking or light cycling 3 days/week (30-45 min), flexibility training 2 days/week."
      : isYoung
      ? "Running or cycling 4 days/week (30-45 min), interval training (sprints) 1 day/week."
      : `Long-distance running or cycling 4 days/week (45-60 min), interval training (sprints or skipping) 1-2 days/week. ${genderModifier}`;
    exerciseTypes = isSenior
      ? "Cardio, Endurance, Flexibility"
      : "Cardio, Endurance, Interval";
    dietPlan =
      dietaryPreferences === "Nigerian Traditional"
        ? `Energy-rich meals like jollof rice, vegetable stew, and boiled yam with fish. ${
            isYoung ? "Include snacks like groundnuts." : ""
          }`
        : dietaryPreferences === "Vegetarian"
        ? "Carb-heavy meals like rice with vegetable stew, beans, and plantain."
        : dietaryPreferences === "Vegan"
        ? "Carb-heavy meals with rice, beans, and vegetable stew."
        : `Balanced meals with rice, chicken, and vegetables for sustained energy. ${
            note.includes("energy") ? "Add fruits like bananas." : ""
          }`;
    goalActions = [
      `Run 5-10km weekly in local fields or tracks to build stamina. ${
        isSenior ? "Start with shorter distances." : ""
      }`,
      "Join a football team for endurance-focused training.",
      "Eat carb-rich meals 2-3 hours before long workouts.",
      `Incorporate traditional dance or swimming for low-impact endurance. ${
        note.includes("joint") ? "Prefer swimming to reduce joint stress." : ""
      }`,
    ];
  } else {
    workoutPlan = isSenior
      ? "Balanced light cardio (e.g., walking) and flexibility exercises 3 days/week."
      : isYoung
      ? "Balanced cardio (e.g., football) and bodyweight exercises 4 days/week."
      : `Balanced cardio (e.g., running, football) and strength training (e.g., bodyweight exercises) 4 days/week. ${genderModifier}`;
    exerciseTypes = "Cardio, Strength, Flexibility";
    dietPlan =
      dietaryPreferences === "Nigerian Traditional"
        ? "Balanced meals with rice, stew, beans, and vegetables."
        : dietaryPreferences === "Vegetarian"
        ? "Vegetarian meals with moi moi, vegetable stew, and yam."
        : dietaryPreferences === "Vegan"
        ? "Vegan meals with beans, rice, and vegetable stew."
        : `Balanced meals with Nigerian staples like rice, stew, beans, and vegetables. ${
            note.includes("variety") ? "Try new recipes weekly." : ""
          }`;
    goalActions = [
      `Exercise 3-4 days/week with a mix of cardio and strength. ${
        isSenior ? "Focus on mobility." : ""
      }`,
      "Eat a variety of local foods like yam, plantain, and fish.",
      "Join community sports like football or dance for social fitness.",
    ];
  }

  if (preferredSports) {
    workoutPlan += ` Incorporate ${preferredSports} into your routine for engagement.`;
    goalActions.push(
      `Engage in ${preferredSports} at least 1-2 times/week for enjoyment and fitness.`
    );
  }

  return { workoutPlan, dietPlan, exerciseTypes, goalActions };
};

export {
  addUserData,
  updateUserDataDetails,
  deleteUserData,
  fetchAllUserData,
  fetchUserDataById,
  sendSubscriptionReminderToUser,
  getUserDataByUserId,
};
