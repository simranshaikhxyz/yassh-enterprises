import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Helper function to generate a 6-digit numeric OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// ==============================
// 1. Register User (Sends OTP)
// ==============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    let user = await User.findOne({ email: cleanEmail });

    // If user exists and is already verified
    if (user && user.isVerified) {
      return res.status(400).json({
        message: "This email is already registered. Please login.",
      });
    }

    // Generate and hash 6-digit OTP
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    if (user && !user.isVerified) {
      // Update existing unverified account with new credentials and OTP
      user.name = cleanName;
      user.password = hashedPassword;
      user.otp = hashedOtp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        otp: hashedOtp,
        otpExpires,
      });
    }

    // Send OTP via Email
    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Verify Your Account - OTP Code",
        text: `Hello ${cleanName},\n\nYour account verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
      });
    } catch (emailError) {
      console.log("Email Dispatch Error:", emailError);
      return res.status(500).json({
        message: "Could not send verification email. Please try again.",
      });
    }

    res.status(201).json({
      message: "Registration successful! Please verify the OTP sent to your email.",
      email: user.email,
    });
  } catch (error) {
    console.log("Register Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "This email is already registered.",
      });
    }

    res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

// ==============================
// 2. Verify Account OTP
// ==============================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    // Clear OTP fields, verify user, & remove TTL expiration index
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    if (user.expireAt) user.expireAt = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: "Account verified successfully!",
    });
  } catch (error) {
    console.log("Verify OTP Error:", error);
    res.status(500).json({ message: "Verification failed. Please try again." });
  }
};

// ==============================
// 3. Resend OTP
// ==============================
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Cooldown guard (1 minute wait time)
    if (user.otpExpires && user.otpExpires.getTime() - Date.now() > 9 * 60 * 1000) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another code.",
      });
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.otp = await bcrypt.hash(otp, salt);
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Resent OTP - Verification Code",
        text: `Hello ${user.name},\n\nYour new verification code is: ${otp}\n\nThis code expires in 10 minutes.`,
      });
    } catch (emailError) {
      return res.status(500).json({ message: "Failed to send email. Try again." });
    }

    res.status(200).json({ message: "New OTP sent to your email." });
  } catch (error) {
    console.log("Resend OTP Error:", error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};

// ==============================
// 4. Login User
// ==============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Require verification before login
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify your email first.",
        isVerified: false,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
};

// ==============================
// 5. Forgot Password (Request OTP) - Anti-Enumeration
// ==============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    // 🛡️ Anti-Enumeration Guard: Return generic response if account does not exist
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      await bcrypt.hash("dummy_otp_delay", salt); // Constant-time delay
      return res.status(200).json({
        message: "If an account with that email exists, an OTP code has been sent.",
      });
    }

    // Cooldown guard (1 minute wait time)
    if (user.resetPasswordExpires && user.resetPasswordExpires.getTime() - Date.now() > 9 * 60 * 1000) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another code.",
      });
    }

    const resetOtp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    user.resetPasswordToken = await bcrypt.hash(resetOtp, salt);
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Password Reset Code",
        text: `Hello ${user.name},\n\nYour password reset OTP code is: ${resetOtp}\n\nIf you did not request this, please ignore this email.`,
      });
    } catch (emailError) {
      return res.status(500).json({ message: "Failed to deliver reset email. Try again." });
    }

    res.status(200).json({
      message: "If an account with that email exists, an OTP code has been sent.",
    });
  } catch (error) {
    console.log("Forgot Password Error:", error);
    res.status(500).json({ message: "Failed to send reset code. Try again." });
  }
};

// ==============================
// 6. Reset Password
// ==============================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid or expired password reset request." });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: "OTP code has expired. Request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetPasswordToken);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    // Check if new password is identical to existing password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as your old password.",
      });
    }

    // Update password & clear reset tokens
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful! You can now login." });
  } catch (error) {
    console.log("Reset Password Error:", error);
    res.status(500).json({ message: "Password reset failed. Please try again." });
  }
};