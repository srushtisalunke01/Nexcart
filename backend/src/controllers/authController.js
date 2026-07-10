/**
 * @module controllers/authController
 * @description Authentication HTTP endpoints.
 *
 * Receives requests, passes data to authService,
 * and standardises responses using ApiResponse.
 */

import authService from "../services/authService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import API_MESSAGES from "../constants/apiMessages.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import { setAccessTokenCookie, setRefreshTokenCookie, clearAuthCookies } from "../helpers/tokenHelper.js";
import env from "../config/env.js";

/**
 * Register a new user.
 * POST /api/v1/auth/register
 */
export const register = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);

  setAccessTokenCookie(res, accessToken, env.IS_PRODUCTION);
  setRefreshTokenCookie(res, refreshToken, env.IS_PRODUCTION);

  return new ApiResponse(HTTP_STATUS.CREATED, API_MESSAGES.AUTH.REGISTER_SUCCESS, {
    user,
    accessToken,
  }).send(res);
};

/**
 * Log in an existing user.
 * POST /api/v1/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  setAccessTokenCookie(res, accessToken, env.IS_PRODUCTION);
  setRefreshTokenCookie(res, refreshToken, env.IS_PRODUCTION);

  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.LOGIN_SUCCESS, {
    user,
    accessToken,
  }).send(res);
};

/**
 * Log out a user.
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res) => {
  await authService.logout(req.user.userId);
  clearAuthCookies(res);

  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.LOGOUT_SUCCESS).send(res);
};

/**
 * Refresh access token.
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req, res) => {
  // Extract refresh token from cookie or body
  const refreshToken = req.cookies?.nexcart_refresh_token || req.body.refreshToken;
  
  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

  setAccessTokenCookie(res, newAccessToken, env.IS_PRODUCTION);
  setRefreshTokenCookie(res, newRefreshToken, env.IS_PRODUCTION);

  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.TOKEN_REFRESHED, {
    accessToken: newAccessToken,
  }).send(res);
};

/**
 * Forgot password.
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.PASSWORD_RESET_SENT).send(res);
};

/**
 * Reset password.
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  
  // Clear cookies as existing sessions are revoked
  clearAuthCookies(res);

  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.PASSWORD_RESET_SUCCESS).send(res);
};

/**
 * Verify email address.
 * POST /api/v1/auth/verify-email
 */
export const verifyEmail = async (req, res) => {
  const { token } = req.body;
  await authService.verifyEmail(token);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.EMAIL_VERIFIED).send(res);
};

/**
 * Resend verification email.
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req, res) => {
  await authService.resendVerification(req.body.email);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.VERIFICATION_EMAIL_SENT).send(res);
};
