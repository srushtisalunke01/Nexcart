/**
 * @module validators/addressValidators
 * @description express-validator rules for address endpoints.
 */

import { body } from "express-validator";
import { nameField, phoneField } from "./commonValidators.js";

export const addressValidators = [
  nameField("recipientName"),
  phoneField("phoneNumber"),
  body("country").notEmpty().withMessage("Country is required."),
  body("state").notEmpty().withMessage("State is required."),
  body("city").notEmpty().withMessage("City is required."),
  body("pincode").notEmpty().withMessage("Pincode is required."),
  body("street").notEmpty().withMessage("Street is required."),
  body("landmark").optional().isString(),
  body("addressType")
    .optional()
    .isIn(["home", "work", "other", "billing", "shipping"])
    .withMessage("Invalid address type."),
  body("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean."),
];
