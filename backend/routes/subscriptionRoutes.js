import express from "express";
import {
  createSubscription,
  getMySubscriptions,
  getAllSubscriptions,
  cancelSubscription,
} from "../controllers/subscriptionController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

// Log to confirm this file is loaded
console.log(
  "SUBSCRIPTIONROUTES.JS LOADED - FIX_500_404 -",
  new Date().toISOString()
);

const router = express.Router();

// Create a new subscription
router.post("/", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: POST /api/subscriptions EXECUTED -",
    new Date().toISOString()
  );
  createSubscription(req, res, next);
});

// Get all active subscriptions (admin only)
router.get("/", authenticate, authorizeAdmin, (req, res, next) => {
  console.log(
    "ROUTE: GET /api/subscriptions EXECUTED -",
    new Date().toISOString()
  );
  getAllSubscriptions(req, res, next);
});

// Get user's subscriptions
router.get("/my", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: GET /api/subscriptions/my EXECUTED -",
    new Date().toISOString()
  );
  getMySubscriptions(req, res, next);
});

// Cancel a subscription
router.patch("/cancel/:id", authenticate, (req, res, next) => {
  console.log(
    "ROUTE: PATCH /api/subscriptions/cancel/:id EXECUTED -",
    new Date().toISOString()
  );
  cancelSubscription(req, res, next);
});

export default router;
