/**
 * @module services/authService
 * @description Authentication business logic.
 *
 * Handles registration, login, token generation, and password resets.
 * Interacts with UserRepository and EmailService.
 */

import crypto from "crypto";
import userRepository from "../repositories/userRepository.js";
import emailService from "./emailService.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../config/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import API_MESSAGES from "../constants/apiMessages.js";
import APP_CONSTANTS from "../constants/appConstants.js";

class AuthService {
  /**
   * Helper to generate a random hex token.
   *
   * @param {number} bytes
   * @returns {string}
   */
  _generateRandomToken(bytes = 32) {
    return crypto.randomBytes(bytes).toString("hex");
  }

  /**
   * Register a new user.
   *
   * @param {Object} userData
   * @returns {Promise<Object>} Object containing user and tokens
   */
  async register(userData) {
    // 1. Check if email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw ApiError.conflict(API_MESSAGES.GENERIC.CONFLICT);
    }

    // 2. Generate verification token
    const verificationToken = this._generateRandomToken(APP_CONSTANTS.EMAIL_VERIFICATION.TOKEN_BYTES);
    const verificationExpires = Date.now() + APP_CONSTANTS.EMAIL_VERIFICATION.TOKEN_EXPIRY_MS;

    // 3. Create user
    const user = await userRepository.create({
      ...userData,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    });

    // 4. Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Save refresh token to user document
    user.refreshToken = refreshToken;
    await userRepository.saveDocument(user);

    // 6. Send verification email (async, fire-and-forget)
    emailService.sendVerificationEmail(user.email, user.fullName, verificationToken);

    // 7. Return user (without sensitive data) and tokens
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;
    delete userResponse.emailVerificationToken;

    return { user: userResponse, accessToken, refreshToken };
  }

  /**
   * Authenticate a user and return tokens.
   *
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Object containing user and tokens
   */
  async login(email, password) {
    // 1. Find user and include password field for comparison
    const user = await userRepository.findByEmail(email, true);
    
    if (!user) {
      throw ApiError.unauthorized(API_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Check if account is disabled
    if (user.status !== "active") {
      throw ApiError.forbidden(API_MESSAGES.AUTH.ACCOUNT_DISABLED);
    }

    // 3. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized(API_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // 4. Generate new tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Update user's refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await userRepository.saveDocument(user);

    // 6. Format response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return { user: userResponse, accessToken, refreshToken };
  }

  /**
   * Log out a user by clearing their refresh token in the DB.
   *
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async logout(userId) {
    const user = await userRepository.findById(userId);
    if (user) {
      user.refreshToken = null;
      await userRepository.saveDocument(user);
    }
    return true;
  }

  /**
   * Refresh an access token using a valid refresh token.
   *
   * @param {string} token - The refresh token
   * @returns {Promise<Object>} Object containing new accessToken and refreshToken
   */
  async refreshToken(token) {
    if (!token) {
      throw ApiError.unauthorized(API_MESSAGES.AUTH.TOKEN_MISSING);
    }

    // 1. Verify token signature and expiration
    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (error) {
      throw ApiError.unauthorized(API_MESSAGES.AUTH.TOKEN_INVALID);
    }

    // 2. Find user AND include the refreshToken field
    const user = await userRepository.findById(decoded.userId, true);
    if (!user) {
      throw ApiError.unauthorized("User no longer exists.");
    }

    if (user.status !== "active") {
      throw ApiError.forbidden(API_MESSAGES.AUTH.ACCOUNT_DISABLED);
    }

    // 3. Prevent Token Reuse / Revoked Tokens
    // The token in the DB must match the provided token
    if (user.refreshToken !== token) {
      // Security measure: if tokens don't match, someone might have stolen the refresh token
      // Revoke all access by clearing the DB token
      user.refreshToken = null;
      await userRepository.saveDocument(user);
      throw ApiError.unauthorized("Refresh token reuse detected or revoked. Please log in again.");
    }

    // 4. Generate new tokens (Rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // 5. Save new refresh token
    user.refreshToken = newRefreshToken;
    await userRepository.saveDocument(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Initiate password reset by generating a token and sending an email.
   *
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    
    // Always return true to prevent email enumeration attacks
    if (!user) return true;

    // Generate reset token
    const resetToken = this._generateRandomToken(APP_CONSTANTS.PASSWORD.RESET_TOKEN_BYTES);
    
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + APP_CONSTANTS.PASSWORD.RESET_TOKEN_EXPIRY_MS;
    
    await userRepository.saveDocument(user);

    // Send email
    emailService.sendPasswordResetEmail(user.email, user.fullName, resetToken);

    return true;
  }

  /**
   * Reset a password using a valid reset token.
   *
   * @param {string} token
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);

    if (!user) {
      throw ApiError.badRequest("Token is invalid or has expired.");
    }

    // Update password (hashing is handled by the pre-save hook in the model)
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Revoke all existing sessions by invalidating the refresh token
    user.refreshToken = null;

    await userRepository.saveDocument(user);

    return true;
  }

  /**
   * Verify a user's email address using a verification token.
   *
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async verifyEmail(token) {
    const user = await userRepository.findByVerificationToken(token);

    if (!user) {
      throw ApiError.badRequest("Verification token is invalid or has expired.");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await userRepository.saveDocument(user);

    return true;
  }

  /**
   * Resend the email verification token.
   *
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async resendVerification(email) {
    const user = await userRepository.findByEmail(email);

    if (!user) return true; // Prevent email enumeration

    if (user.isEmailVerified) {
      throw ApiError.badRequest(API_MESSAGES.AUTH.EMAIL_ALREADY_VERIFIED);
    }

    const verificationToken = this._generateRandomToken(APP_CONSTANTS.EMAIL_VERIFICATION.TOKEN_BYTES);
    const verificationExpires = Date.now() + APP_CONSTANTS.EMAIL_VERIFICATION.TOKEN_EXPIRY_MS;

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await userRepository.saveDocument(user);

    emailService.sendVerificationEmail(user.email, user.fullName, verificationToken);

    return true;
  }
}

export default new AuthService();
