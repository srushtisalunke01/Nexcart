/**
 * @module config/multer
 * @description Multer configuration for multipart/form-data file uploads.
 *
 * Strategy:
 *   - Files are temporarily stored on disk in /uploads/temp/
 *   - After processing, they are uploaded to Cloudinary
 *   - Temp files should be deleted after successful Cloudinary upload
 *
 * Security:
 *   - File type filtering via mimetype whitelist
 *   - File size limits enforced at the Multer level
 *   - Unique filenames to prevent collisions
 *
 * Usage:
 *   import { uploadSingle, uploadMultiple } from './config/multer.js';
 *   router.post('/upload', uploadSingle('avatar'), controller);
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

// ─── Upload Directory ─────────────────────────────────────────────────────────
const TEMP_UPLOAD_DIR = path.resolve("uploads/temp");

// Ensure temp directory exists at startup
if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

// ─── File Size Limits ─────────────────────────────────────────────────────────
export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024,     // 5MB
  document: 10 * 1024 * 1024, // 10MB
};

// ─── Allowed MIME Types ───────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// ─── Disk Storage ─────────────────────────────────────────────────────────────
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp-random.extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  },
});

// ─── File Filter ──────────────────────────────────────────────────────────────
/**
 * Creates a Multer file filter that only accepts specified MIME types.
 *
 * @param {string[]} allowedTypes - Array of allowed MIME type strings
 * @returns {Function} Multer fileFilter function
 */
const createFileFilter = (allowedTypes) => (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        `Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(", ")}`
      ),
      false
    );
  }
};

// ─── Multer Instance Factories ────────────────────────────────────────────────

/**
 * Creates a multer middleware for a single image file upload.
 *
 * @param {string} fieldName - The form field name for the file
 * @param {number} [maxSize] - Maximum file size in bytes (default: 5MB)
 * @returns {Function} Express middleware
 */
export const uploadSingleImage = (fieldName, maxSize = FILE_SIZE_LIMITS.image) => {
  return multer({
    storage: diskStorage,
    limits: { fileSize: maxSize },
    fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
  }).single(fieldName);
};

/**
 * Creates a multer middleware for multiple image file uploads.
 *
 * @param {string} fieldName - The form field name for the files
 * @param {number} [maxCount=5] - Maximum number of files
 * @param {number} [maxSize] - Maximum size per file in bytes (default: 5MB)
 * @returns {Function} Express middleware
 */
export const uploadMultipleImages = (
  fieldName,
  maxCount = 5,
  maxSize = FILE_SIZE_LIMITS.image
) => {
  return multer({
    storage: diskStorage,
    limits: { fileSize: maxSize },
    fileFilter: createFileFilter(ALLOWED_IMAGE_TYPES),
  }).array(fieldName, maxCount);
};

/**
 * Deletes a temporary file from disk.
 * Call this after a successful Cloudinary upload or on error.
 *
 * @param {string} filePath - Absolute path to the file to delete
 * @returns {void}
 */
export const deleteTempFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // Non-critical — file may already be cleaned up
  }
};
