import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addUserData,
  updateUserDataDetails,
  removeUserData,
  fetchUserData,
  fetchUserDataById,
  fetchAllUserData,
} from "../controllers/userdataController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/", authenticate)
  .get(fetchUserData, authenticate)
  .post(formidable(), addUserData, authenticate);

router.route("/alluserdata").get(fetchAllUserData, authenticate);

router
  .route("/:id")
  .get(fetchUserDataById)
  .put(updateUserDataDetails, authenticate)

  .delete(removeUserData, authorizeAdmin),
  authorizeAdmin;

export default router;
