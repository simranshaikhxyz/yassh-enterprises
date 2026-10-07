import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // 🛡️ Guard: Auto-deletes unverified junk accounts after 24 hours
    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Dynamically set 24h from creation
      index: { expires: 0 }, // Expires exactly at the timestamp value stored in expireAt
    },
  },
  { timestamps: true }
);

// Method to mark user as verified and cancel TTL auto-deletion
userSchema.methods.markAsVerified = async function () {
  this.isVerified = true;
  this.otp = undefined;
  this.otpExpires = undefined;
  this.expireAt = null; // Setting to null disables MongoDB TTL deletion for verified users
  return await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;