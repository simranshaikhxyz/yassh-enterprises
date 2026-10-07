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

// 🛡️ Limiter 1: Registration Limiter (Max 5 accounts per 1 hour per IP)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5,
  message: { message: "Too many account creations from this IP. Please try again after an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛡️ Limiter 2: Strict Login & Reset Request Limiter (Max 5 attempts per 15 mins)
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 5,
  message: { message: "Too many failed attempts. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🛡️ Limiter 3: OTP Verification & Resend Limiter (Max 10 attempts per 15 mins)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 10,
  message: { message: "Too many OTP requests or verification attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Route mapping with target-specific rate limiting
router.post("/register", registerLimiter, registerUser);
router.post("/verify-otp", otpLimiter, verifyOTP);
router.post("/resend-otp", otpLimiter, resendOTP);
router.post("/login", strictAuthLimiter, loginUser);
router.post("/forgot-password", strictAuthLimiter, forgotPassword);
router.post("/reset-password", strictAuthLimiter, resetPassword);

export default router;