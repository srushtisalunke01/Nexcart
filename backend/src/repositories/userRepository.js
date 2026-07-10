/**
 * @module repositories/userRepository
 * @description Database operations for the User model.
 *
 * This layer abstracts Mongoose queries so the Service layer
 * doesn't need to know about database implementation details.
 * Contains strictly DB logic, no business rules.
 */

import User from "../models/user.model.js";

class UserRepository {
  /**
   * Create a new user.
   *
   * @param {Object} userData
   * @returns {Promise<Object>} Created user document
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find a user by email.
   * By default, it ignores soft-deleted users due to the query middleware.
   *
   * @param {string} email
   * @param {boolean} [includePassword=false] - Whether to include the password field
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email, includePassword = false) {
    let query = User.findOne({ email });
    if (includePassword) {
      query = query.select("+password");
    }
    return await query;
  }

  /**
   * Find a user by ID.
   *
   * @param {string} id
   * @param {boolean} [includeRefreshToken=false] - Whether to include the refreshToken field
   * @returns {Promise<Object|null>}
   */
  async findById(id, includeRefreshToken = false) {
    let query = User.findById(id);
    if (includeRefreshToken) {
      query = query.select("+refreshToken");
    }
    return await query;
  }

  /**
   * Find a user by password reset token.
   *
   * @param {string} token
   * @returns {Promise<Object|null>}
   */
  async findByResetToken(token) {
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
  }

  /**
   * Find a user by email verification token.
   *
   * @param {string} token
   * @returns {Promise<Object|null>}
   */
  async findByVerificationToken(token) {
    return await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });
  }

  /**
   * Update a user by ID.
   *
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} [options={ new: true, runValidators: true }]
   * @returns {Promise<Object|null>}
   */
  async updateById(id, updateData, options = { new: true, runValidators: true }) {
    return await User.findByIdAndUpdate(id, updateData, options);
  }

  /**
   * Soft delete a user by ID.
   *
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async softDelete(id) {
    return await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        status: "inactive",
        refreshToken: null,
      },
      { new: true }
    );
  }

  /**
   * Save an existing user document (useful when methods like password hashing are needed).
   *
   * @param {Object} userDoc - A Mongoose document instance
   * @returns {Promise<Object>}
   */
  async saveDocument(userDoc) {
    return await userDoc.save();
  }
}

export default new UserRepository();
