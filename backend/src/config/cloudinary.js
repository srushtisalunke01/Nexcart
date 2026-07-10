/**
 * @module config/cloudinary
 * @description Cloudinary SDK initialisation and upload utilities.
 *
 * Cloudinary is used for:
 *   - Product images (Phase 1C+)
 *   - User profile avatars (Phase 1B)
 *   - Banner images (future)
 *
 * This module initialises the Cloudinary v2 SDK with credentials
 * from environment variables. Image upload helpers will be built
 * in Phase 1B when the upload feature is implemented.
 *
 * Usage:
 *   import cloudinary from './config/cloudinary.js';
 *   const result = await cloudinary.uploader.upload(filePath, options);
 */

import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";
import logger from "./logger.js";

// ─── Initialisation ───────────────────────────────────────────────────────────
// Cloudinary auto-detects credentials from the config call.
// This must run before any upload calls.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  // Force secure (https) URLs
  secure: true,
});

// Log initialisation status
if (env.CLOUDINARY_CLOUD_NAME) {
  logger.info(`[Cloudinary] Initialised → cloud: ${env.CLOUDINARY_CLOUD_NAME}`);
} else {
  logger.warn(
    "[Cloudinary] Credentials not provided. Image uploads will fail until configured."
  );
}

// ─── Upload Configuration Presets ────────────────────────────────────────────
// Centralised upload options for different use cases.
// Used in Phase 1B+ when upload features are implemented.
export const UPLOAD_PRESETS = {
  /** For user profile avatars */
  avatar: {
    folder: "nexcart/avatars",
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    max_bytes: 2 * 1024 * 1024, // 2MB
  },

  /** For product images */
  product: {
    folder: "nexcart/products",
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    max_bytes: 5 * 1024 * 1024, // 5MB
  },

  /** For banner / hero images */
  banner: {
    folder: "nexcart/banners",
    transformation: [{ width: 1920, height: 600, crop: "fill", quality: "auto" }],
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    max_bytes: 8 * 1024 * 1024, // 8MB
  },
};

/**
 * Uploads a file to Cloudinary from a local file path.
 *
 * @param {string} filePath - Absolute path to the temporary file
 * @param {Object} options - Cloudinary upload options (use UPLOAD_PRESETS)
 * @returns {Promise<Object>} Cloudinary upload result
 * @throws {Error} If upload fails
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    logger.info("[Cloudinary] File uploaded successfully.", {
      publicId: result.public_id,
      url: result.secure_url,
    });
    return result;
  } catch (error) {
    logger.error("[Cloudinary] Upload failed.", { error: error.message });
    throw error;
  }
};

/**
 * Deletes a file from Cloudinary by its public ID.
 *
 * @param {string} publicId - The Cloudinary public ID to delete
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("[Cloudinary] File deleted.", { publicId });
    return result;
  } catch (error) {
    logger.error("[Cloudinary] Deletion failed.", { error: error.message, publicId });
    throw error;
  }
};

export default cloudinary;
