/**
 * @module validators/authValidators
 * @description express-validator rules for authentication endpoints.
 */

import { body } from "express-validator";
import { emailField, passwordField, nameField, phoneField } from "./commonValidators.js";

export const registerValidators = [
  nameField("fullName"),
  emailField,
  passwordField,
  phoneField("phoneNumber"),
];

export const loginValidators = [
  emailField,
  body("password").notEmpty().withMessage("Password is required."),
];

export const forgotPasswordValidators = [
  emailField,
];

export const resetPasswordValidators = [
  body("token").notEmpty().withMessage("Reset token is required."),
  passwordField.withMessage("New password must meet criteria (min 8 chars, 1 uppercase, 1 lowercase, 1 number)."),
];

export const verifyEmailValidators = [
  body("token").notEmpty().withMessage("Verification token is required."),
];

export const resendVerificationValidators = [
  emailField,
];
