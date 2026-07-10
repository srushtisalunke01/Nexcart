/**
 * @module models/address.model
 * @description Address schema definition.
 *
 * Each user can have multiple saved addresses.
 * The schema supports future functionality like marketplace sellers
 * (who may also have pickup/business addresses).
 */

import mongoose from "mongoose";
import APP_CONSTANTS from "../constants/appConstants.js";

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    recipientName: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
      minlength: [2, "Recipient name must be at least 2 characters"],
      maxlength: [100, "Recipient name cannot exceed 100 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\+?[\d\s\-().]{7,20}$/, "Please provide a valid phone number"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India", // Assuming default region, adjustable per requirements
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode / Postal code is required"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    addressType: {
      type: String,
      enum: ["home", "work", "other", "billing", "shipping"],
      default: "home",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ────────────────────────────────────────────────────────────────
// Optimise finding addresses by user and default status
addressSchema.index({ user: 1, isDefault: 1 });

// ─── Document Middleware ────────────────────────────────────────────────────

/**
 * Pre-save hook: Ensure only one default address exists per user.
 * If this address is set to default, unset isDefault for all other addresses of this user.
 */
addressSchema.pre("save", async function (next) {
  if (this.isModified("isDefault") && this.isDefault) {
    try {
      await mongoose.model(APP_CONSTANTS.COLLECTIONS.USERS + "_Address", addressSchema).updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
    } catch (error) {
      // Ignore model name issue during initialization by using this.constructor
      await this.constructor.updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { $set: { isDefault: false } }
      );
    }
  }
  next();
});

// ─── Model Export ───────────────────────────────────────────────────────────
// Appending '_Address' to collection if appConstants doesn't have it, but for simplicity we use 'addresses'
const Address = mongoose.model("addresses", addressSchema);

export default Address;
