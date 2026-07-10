/**
 * @module middlewares/authMiddleware
 * @description JWT authentication middleware.
 *
 * Verifies the access token from:
 *   1. Authorization: Bearer <token> header
 *   2. HttpOnly cookie (nexcart_access_token)
 *
 * On success: Attaches decoded user payload to req.user
 * On failure: Passes ApiError(401) to next()
 *
 * NOTE: This module is a STUB for Phase 1A.
 * Full implementation (with database user lookup) happens in Phase 1B
 * when the User model is created.
 *
 * Usage:
 *   import { protect } from '../middlewares/authMiddleware.js';
 *   router.get('/profile', protect, profileController);
 */

import { verifyAccessToken } from "../config/jwt.js";
import { extractAccessToken } from "../helpers/tokenHelper.js";
import { ApiError } from "../utils/ApiError.js";
import API_MESSAGES from "../constants/apiMessages.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/userRepository.js";

/**
 * Protects routes by verifying the JWT access token.
 *
 * Attaches the decoded token payload to req.user:
 *   req.user = { userId: string, role: string, iat: number, exp: number }
 *
 * Phase 1B enhancement: After verifying the token, this middleware
 * will also fetch the full user document from the database and attach
 * it to req.user, enabling role checks and user-specific logic.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  // Extract token from header or cookie
  const token = extractAccessToken(req);

  if (!token) {
    throw new ApiError.unauthorized(API_MESSAGES.AUTH.TOKEN_MISSING);
  }

  // Verify the token — throws JsonWebTokenError or TokenExpiredError if invalid
  const decoded = verifyAccessToken(token);

  // Attach decoded payload to request temporarily
  req.user = decoded;

  // Database user lookup
  const user = await userRepository.findById(decoded.userId);
  if (!user) throw ApiError.unauthorized('User no longer exists.');
  if (user.status !== "active") throw ApiError.forbidden('Account disabled.');
  
  // Attach full user object for downstream use
  req.user = {
    userId: user._id,
    role: user.role,
    status: user.status,
  };

  next();
});

/**
 * Optional authentication middleware.
 * Does NOT throw if the token is missing or invalid.
 * Useful for endpoints that behave differently for logged-in vs guest users.
 *
 * If a valid token is present, sets req.user.
 * If not, sets req.user = null and continues.
 */
export const optionalAuth = asyncHandler(async (req, _res, next) => {
  try {
    const token = extractAccessToken(req);
    if (token) {
      req.user = verifyAccessToken(token);
    } else {
      req.user = null;
    }
  } catch {
    // Silently ignore token errors for optional auth
    req.user = null;
  }
  next();
});
