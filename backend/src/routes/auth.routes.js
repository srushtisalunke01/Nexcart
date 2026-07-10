/**
 * @module routes/auth.routes
 * @description Authentication routes.
 */

import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  registerValidators,
  loginValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  verifyEmailValidators,
  resendVerificationValidators,
} from "../validators/authValidators.js";
import rateLimit from "express-rate-limit";
import APP_CONSTANTS from "../constants/appConstants.js";

const router = Router();

// Apply stricter rate limits to auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMIT.AUTH_WINDOW_MS,
  max: APP_CONSTANTS.RATE_LIMIT.AUTH_MAX_REQUESTS,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many login/register attempts. Please try again later.",
  },
});

router.post("/register", authLimiter, registerValidators, validate, register);
router.post("/login", authLimiter, loginValidators, validate, login);
router.post("/refresh", refresh); // Uses cookie or body token
router.post("/forgot-password", authLimiter, forgotPasswordValidators, validate, forgotPassword);
router.post("/reset-password", authLimiter, resetPasswordValidators, validate, resetPassword);
router.post("/verify-email", authLimiter, verifyEmailValidators, validate, verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationValidators, validate, resendVerification);

// Protected Auth Route
router.post("/logout", protect, logout);

export default router;
