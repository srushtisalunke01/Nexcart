/**
 * @module validators/userValidators
 * @description express-validator rules for user profile endpoints.
 */

import { body } from "express-validator";
import { nameField, phoneField, passwordField } from "./commonValidators.js";

export const updateProfileValidators = [
  nameField("fullName").optional(),
  phoneField("phoneNumber").optional(),
  body("gender")
    .optional()
    .isIn(["male", "female", "other", "prefer_not_to_say"])
    .withMessage("Invalid gender selection."),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date of birth must be a valid date."),
];

export const changePasswordValidators = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  passwordField.withMessage("New password must meet criteria (min 8 chars, 1 uppercase, 1 lowercase, 1 number)."),
];
