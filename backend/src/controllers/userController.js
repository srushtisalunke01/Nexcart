/**
 * @module controllers/userController
 * @description User HTTP endpoints.
 *
 * Handles profile retrieval, updates, and account deletion.
 */

import userService from "../services/userService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import API_MESSAGES from "../constants/apiMessages.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import { clearAuthCookies } from "../helpers/tokenHelper.js";

/**
 * Get current user profile.
 * GET /api/v1/users/me
 */
export const getProfile = async (req, res) => {
  const profile = await userService.getProfile(req.user.userId);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.PROFILE_FETCHED, profile).send(res);
};

/**
 * Update current user profile.
 * PUT /api/v1/users/profile
 */
export const updateProfile = async (req, res) => {
  const profile = await userService.updateProfile(req.user.userId, req.body);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.PROFILE_UPDATED, profile).send(res);
};

/**
 * Change current user password.
 * PUT /api/v1/users/password
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user.userId, currentPassword, newPassword);
  
  // Clear cookies as existing sessions are revoked
  clearAuthCookies(res);

  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.PASSWORD_CHANGED).send(res);
};

/**
 * Upload/update current user avatar.
 * PATCH /api/v1/users/avatar
 */
export const updateAvatar = async (req, res) => {
  const avatar = await userService.updateAvatar(req.user.userId, req.file);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.AVATAR_UPDATED, avatar).send(res);
};

/**
 * Remove current user avatar.
 * DELETE /api/v1/users/avatar
 */
export const removeAvatar = async (req, res) => {
  await userService.removeAvatar(req.user.userId);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.AVATAR_UPDATED).send(res);
};

/**
 * Deactivate (soft delete) current user account.
 * DELETE /api/v1/users/
 */
export const deactivateAccount = async (req, res) => {
  await userService.deactivateAccount(req.user.userId);
  clearAuthCookies(res);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.GENERIC.DELETED).send(res);
};
