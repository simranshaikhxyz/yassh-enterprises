
import crypto from "crypto";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const OTP_EXPIRY_MINUTES = 10;

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const generateOTP = () =>
  String(crypto.randomInt(100000, 1000000));

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
});

// ================= REGISTER =================

export const registerUser = async (req, res) => {
  let user;
  let isNewUser = false;
  let previousValues;

  try {
    const { name, email, password } = req.body || {};

    const cleanName = String(name || "").trim();
    const cleanEmail = normalizeEmail(email);

    if (
      !cleanName ||
      !cleanEmail ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (cleanName.length > 50) {
      return res.status(400).json({
        message: "Name cannot exceed 50 characters.",
      });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    user = await User.findOne({ email: cleanEmail });

    if (user?.isVerified) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = generateOTP();

    if (!user) {
      user = new User({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
      });

      isNewUser = true;
    } else {
      previousValues = {
        name: user.name,
        password: user.password,
        otp: user.otp,
        otpExpires: user.otpExpires,
        expireAt: user.expireAt,
      };
    }

    user.name = cleanName;
    user.password = hashedPassword;
    user.otp = hashValue(otp);
    user.otpExpires = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );
    user.expireAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    await user.save();

    try {
      await sendEmail({
        to: cleanEmail,
        subject: "Verify Your Account - YASSH ENTERPRISES",
        text: `Hello ${cleanName},

Your verification code is: ${otp}

This code expires in ${OTP_EXPIRY_MINUTES} minutes.

If you did not request this code, please ignore this email.`,
      });
    } catch (emailError) {
      console.error(
        "Registration email error:",
        emailError.message
      );

      if (isNewUser) {
        await User.deleteOne({ _id: user._id });
      } else {
        Object.assign(user, previousValues);
        await user.save();
      }

      return res.status(502).json({
        message:
          "Unable to send the verification email. Please try again.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Verification code sent to your email.",
      email: cleanEmail,
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || "").trim();

    if (!isValidEmail(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Enter a valid email and 6-digit OTP.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please register again.",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Your account is already verified.",
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        message: "No active OTP found. Request a new code.",
      });
    }

    if (user.otpExpires.getTime() <= Date.now()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      return res.status(400).json({
        message: "OTP has expired. Please request a new code.",
      });
    }

    if (hashValue(otp) !== user.otp) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
      });
    }

    await user.markAsVerified();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      message: "OTP verification failed. Please try again.",
    });
  }
};

// ================= RESEND OTP =================

export const resendOTP = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Account not found. Please register again.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Your account is already verified.",
      });
    }

    const previousOTP = user.otp;
    const previousExpiry = user.otpExpires;
    const otp = generateOTP();

    user.otp = hashValue(otp);
    user.otpExpires = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: "Your New Verification Code - YASSH ENTERPRISES",
        text: `Hello ${user.name},

Your new verification code is: ${otp}

This code expires in ${OTP_EXPIRY_MINUTES} minutes.

If you did not request this code, please ignore this email.`,
      });
    } catch (emailError) {
      console.error(
        "Resend OTP email error:",
        emailError.message
      );

      user.otp = previousOTP;
      user.otpExpires = previousExpiry;
      await user.save();

      return res.status(502).json({
        message: "Could not resend the OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new verification code has been sent.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error.message);

    return res.status(500).json({
      message: "Could not resend OTP. Please try again.",
    });
  }
};

// ================= LOGIN =================

export const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body || {};

    if (!isValidEmail(email) ||
        typeof password !== "string" ||
        !password) {
      return res.status(400).json({
        message: "A valid email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
};

// ================= FORGOT PASSWORD (OTP) =================

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const user = await User.findOne({
      email,
      isVerified: true,
    });

    // Avoid revealing whether an account exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If a verified account exists, a reset OTP will be sent.",
      });
    }

    const otp = generateOTP();

    user.resetPasswordOTP = hashValue(otp);
    user.resetPasswordOTPExpires = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    );

    await user.save();

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset OTP - YASSH ENTERPRISES",
        text: `Hello ${user.name},

Your password reset OTP is: ${otp}

This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.

If you did not request this, please ignore this email.`,
      });
    } catch (emailError) {
      console.error(
        "Password reset email error:",
        emailError.message
      );

      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();

      return res.status(502).json({
        message: "Could not send OTP. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Could not process your request. Please try again.",
    });
  }
};

// ================= RESET PASSWORD (OTP) =================

export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || "").trim();
    const { newPassword } = req.body || {};

    if (
      !isValidEmail(email) ||
      !/^\d{6}$/.test(otp) ||
      typeof newPassword !== "string" ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "Enter email, 6-digit OTP and new password.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const user = await User.findOne({
      email,
      isVerified: true,
    });

    if (
      !user ||
      !user.resetPasswordOTP ||
      !user.resetPasswordOTPExpires
    ) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Request a new code.",
      });
    }

    if (user.resetPasswordOTPExpires.getTime() <= Date.now()) {
      user.resetPasswordOTP = undefined;
      user.resetPasswordOTPExpires = undefined;
      await user.save();

      return res.status(400).json({
        message: "OTP expired. Please request a new code.",
      });
    }

    if (hashValue(otp) !== user.resetPasswordOTP) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    // OTP can only be used once.
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    // Clear old reset-link fields, if present.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Could not reset password. Please try again.",
    });
  }
};
