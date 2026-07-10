/**
 * @module middlewares/uploadMiddleware
 * @description Route-level Multer upload middleware wrappers.
 *
 * These middlewares wrap the Multer config from config/multer.js
 * and handle Multer-specific errors gracefully, converting them
 * to ApiError instances for the global error handler.
 *
 * Usage:
 *   import { uploadAvatar, uploadProductImages } from '../middlewares/uploadMiddleware.js';
 *
 *   router.post('/profile/avatar', protect, uploadAvatar, updateAvatar);
 *   router.post('/products', protect, requireSeller, uploadProductImages, createProduct);
 */

import multer from "multer";
import { uploadSingleImage, uploadMultipleImages } from "../config/multer.js";
import { ApiError } from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * Wraps a Multer middleware and converts Multer-specific errors
 * (e.g. LIMIT_FILE_SIZE) into ApiErrors for consistent handling.
 *
 * @param {Function} multerMiddleware - A configured Multer middleware
 * @returns {Function} Express middleware with error normalisation
 */
const wrapMulterMiddleware = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      // Handle Multer-specific errors
      if (err instanceof multer.MulterError) {
        const messages = {
          LIMIT_FILE_SIZE: "File size exceeds the allowed limit.",
          LIMIT_FILE_COUNT: "Too many files uploaded.",
          LIMIT_UNEXPECTED_FILE: `Unexpected file field: '${err.field}'.`,
        };
        return next(
          new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            messages[err.code] || `File upload error: ${err.message}`
          )
        );
      }

      // Pass other errors (e.g. invalid file type ApiError) through
      next(err);
    });
  };
};

/**
 * Upload middleware for a single user avatar.
 * Field name: "avatar"
 * Max size: 2MB (stricter for avatars)
 */
export const uploadAvatar = wrapMulterMiddleware(
  uploadSingleImage("avatar", 2 * 1024 * 1024)
);

/**
 * Upload middleware for a single product image.
 * Field name: "image"
 */
export const uploadProductImage = wrapMulterMiddleware(
  uploadSingleImage("image")
);

/**
 * Upload middleware for multiple product images (up to 10).
 * Field name: "images"
 */
export const uploadProductImages = wrapMulterMiddleware(
  uploadMultipleImages("images", 10)
);

/**
 * Upload middleware for a single banner image.
 * Field name: "banner"
 * Max size: 8MB
 */
export const uploadBanner = wrapMulterMiddleware(
  uploadSingleImage("banner", 8 * 1024 * 1024)
);
