/**
 * @module services/userService
 * @description User business logic.
 *
 * Handles profile retrieval, updates, avatar uploads (Cloudinary),
 * and account deactivation.
 */

import userRepository from "../repositories/userRepository.js";
import { uploadToCloudinary, deleteFromCloudinary, UPLOAD_PRESETS } from "../config/cloudinary.js";
import { deleteTempFile } from "../config/multer.js";
import { ApiError } from "../utils/ApiError.js";
import API_MESSAGES from "../constants/apiMessages.js";

class UserService {
  /**
   * Get a user's profile by ID.
   *
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User");
    }
    
    // We don't want to expose some internal flags to the frontend
    const profile = user.toObject();
    delete profile.password;
    delete profile.refreshToken;
    delete profile.emailVerificationToken;
    delete profile.passwordResetToken;
    
    return profile;
  }

  /**
   * Update a user's profile.
   *
   * @param {string} userId
   * @param {Object} updateData (e.g., fullName, phoneNumber, gender, dob)
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    // Prevent changing restricted fields via profile update
    const allowedUpdates = ["fullName", "phoneNumber", "gender", "dateOfBirth"];
    
    const filteredUpdate = Object.keys(updateData)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    const updatedUser = await userRepository.updateById(userId, filteredUpdate);
    
    if (!updatedUser) {
      throw ApiError.notFound("User");
    }

    const profile = updatedUser.toObject();
    delete profile.password;
    
    return profile;
  }

  /**
   * Change user password.
   *
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId, true);
    if (!user) {
      throw ApiError.notFound("User");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest("Current password is incorrect.");
    }

    user.password = newPassword;
    
    // Changing password should ideally revoke existing sessions 
    // by clearing the refresh token to force re-login on other devices.
    user.refreshToken = null; 

    await userRepository.saveDocument(user);

    return true;
  }

  /**
   * Update user avatar using Cloudinary.
   *
   * @param {string} userId
   * @param {Object} file - Express Multer file object
   * @returns {Promise<Object>}
   */
  async updateAvatar(userId, file) {
    if (!file) {
      throw ApiError.badRequest("No image file provided.");
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      deleteTempFile(file.path);
      throw ApiError.notFound("User");
    }

    try {
      // 1. Upload to Cloudinary
      const result = await uploadToCloudinary(file.path, UPLOAD_PRESETS.avatar);

      // 2. Delete old avatar from Cloudinary if it exists
      if (user.profilePicture?.publicId) {
        await deleteFromCloudinary(user.profilePicture.publicId);
      }

      // 3. Update user profile
      user.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      await userRepository.saveDocument(user);

      return user.profilePicture;
    } finally {
      // 4. Always clean up the temp file on disk
      deleteTempFile(file.path);
    }
  }

  /**
   * Remove user avatar.
   *
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async removeAvatar(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User");
    }

    if (user.profilePicture?.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    user.profilePicture = undefined;
    await userRepository.saveDocument(user);

    return true;
  }

  /**
   * Soft delete / deactivate account.
   *
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async deactivateAccount(userId) {
    const user = await userRepository.softDelete(userId);
    if (!user) {
      throw ApiError.notFound("User");
    }
    
    return true;
  }
}

export default new UserService();
