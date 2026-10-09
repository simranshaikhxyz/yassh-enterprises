
import express from "express";
import rateLimit from "express-rate-limit";

import {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Registration: maximum 5 requests per hour per IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many registration attempts. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login and password reset: maximum 5 requests per 15 minutes per IP
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many attempts. Please wait 15 minutes and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP verification and resend: maximum 10 requests per 15 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many OTP attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication routes
router.post("/register", registerLimiter, registerUser);
router.post("/verify-otp", otpLimiter, verifyOTP);
router.post("/resend-otp", otpLimiter, resendOTP);
router.post("/login", strictAuthLimiter, loginUser);
router.post("/forgot-password", strictAuthLimiter, forgotPassword);
router.post("/reset-password", strictAuthLimiter, resetPassword);

export default router;