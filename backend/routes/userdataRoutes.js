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
import { authenticate,  authorizeAdmin } from "../middlewares/authMiddleware.js";


router
  .route("/")
  .get(fetchUserData, authorizeAdmin)
  .post(authenticate, formidable(), addUserData);

router.route("/alluserdata").get(fetchAllUserData);

router
  .route("/:id")
  .get(fetchUserDataById)
  .put(authenticate, authorizeAdmin, formidable(), updateUserDataDetails)
  .delete(authenticate, authorizeAdmin, removeUserData);

export default router;
