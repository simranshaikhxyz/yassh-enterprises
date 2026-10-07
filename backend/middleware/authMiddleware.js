import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🛡️ Middleware 1: Protect routes requiring authentication
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // Extract token from Bearer scheme
      token = authHeader.split(" ")[1];

      // Verify JWT token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB and exclude sensitive fields (password, otp)
      req.user = await User.findById(decoded.id).select("-password -otp -otpExpires");

      // 🛡️ Guard: Check if user document still exists in MongoDB
      if (!req.user) {
        return res.status(401).json({
          message: "Not authorized, user account no longer exists",
        });
      }

      // 🛡️ Guard: Ensure user account has verified status
      if (!req.user.isVerified) {
        return res.status(403).json({
          message: "Access denied. Account is not verified.",
        });
      }

      next();
    } catch (error) {
      // Avoid logging sensitive token data to stdout in production
      if (process.env.NODE_ENV !== "production") {
        console.error("JWT Verification Error:", error.message);
      }

      return res.status(401).json({
        message: "Not authorized, token invalid or expired",
      });
    }
  } else {
    return res.status(401).json({
      message: "Not authorized, missing bearer token",
    });
  }
};

// 🛡️ Middleware 2: Restrict route access exclusively to administrators
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Administrator privileges required.",
    });
  }
};