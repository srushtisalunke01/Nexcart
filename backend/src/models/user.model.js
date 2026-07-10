/**
 * @module models/user.model
 * @description User schema definition.
 *
 * Implements:
 *   - Password hashing via pre-save hook
 *   - Password validation method
 *   - JWT-friendly virtuals
 *   - Soft delete functionality
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import APP_CONSTANTS from "../constants/appConstants.js";
import { ALL_ROLES, ROLES } from "../types/roles.types.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Allows null/undefined values to be ignored by unique index
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Prevents password from being returned in queries by default
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },
    profilePicture: {
      url: { type: String },
      publicId: { type: String },
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say",
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.USER,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    refreshToken: {
      type: String,
      select: false,
    },
    loginProvider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    lastLogin: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────
// Improve query performance for common lookups
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

// ─── Document Middleware ────────────────────────────────────────────────────

/**
 * Pre-save hook to hash passwords before saving.
 * Only runs if the password field was modified.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(APP_CONSTANTS.PASSWORD.BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Update passwordChangedAt if this is not a new document
    if (!this.isNew) {
      // Subtract 1 second to ensure token created immediately after is valid
      this.passwordChangedAt = Date.now() - 1000;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Query Middleware ───────────────────────────────────────────────────────

/**
 * Filter out soft-deleted users from regular queries.
 */
userSchema.pre(/^find/, function (next) {
  // 'this' points to the current query
  // Ignore deleted users unless explicitly requested
  if (this.getFilter().isDeleted !== true) {
    this.find({ isDeleted: { $ne: true } });
  }
  next();
});

// ─── Instance Methods ───────────────────────────────────────────────────────

/**
 * Compare plain text password with hashed password.
 *
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Check if the user's password was changed after a JWT token was issued.
 *
 * @param {number} jwtTimestamp - Issued at timestamp from token
 * @returns {boolean} True if password changed after token issuance
 */
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtTimestamp < changedTimestamp;
  }
  return false; // Password not changed
};

// ─── Model Export ───────────────────────────────────────────────────────────
const User = mongoose.model(APP_CONSTANTS.COLLECTIONS.USERS, userSchema);

export default User;
