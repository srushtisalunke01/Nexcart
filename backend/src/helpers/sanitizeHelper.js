/**
 * @module helpers/sanitizeHelper
 * @description Input sanitisation utilities.
 *
 * Provides helpers to clean and normalise user-supplied input
 * before it reaches business logic or database queries.
 *
 * Note: express-mongo-sanitize is applied globally in app.js
 * to strip MongoDB operators ($, .) from all req.body/params/query.
 * These helpers handle additional string-level sanitisation.
 *
 * Usage:
 *   import { sanitizeString, sanitizeEmail } from './sanitizeHelper.js';
 */

/**
 * Trims whitespace from a string value.
 * Returns an empty string if the value is not a string.
 *
 * @param {*} value
 * @returns {string}
 */
export const sanitizeString = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

/**
 * Sanitises and normalises an email address.
 * - Trims whitespace
 * - Converts to lowercase
 *
 * @param {string} email
 * @returns {string} Normalised email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase();
};

/**
 * Strips HTML tags from a string to prevent XSS in stored content.
 * For rich text, use a proper sanitisation library like DOMPurify (server-side).
 * This is a lightweight fallback for plain text fields.
 *
 * @param {string} value
 * @returns {string} String with HTML tags removed
 */
export const stripHtml = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/<[^>]*>/g, "").trim();
};

/**
 * Converts a value to a safe integer.
 * Returns a default value if conversion fails or result is NaN.
 *
 * @param {*} value
 * @param {number} [defaultValue=0]
 * @returns {number}
 */
export const toSafeInt = (value, defaultValue = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Converts a value to a safe positive float.
 * Returns a default value if conversion fails, result is NaN, or negative.
 *
 * @param {*} value
 * @param {number} [defaultValue=0]
 * @returns {number}
 */
export const toSafeFloat = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) || parsed < 0 ? defaultValue : parsed;
};

/**
 * Sanitises a MongoDB ObjectId string.
 * Returns null if the value does not match the ObjectId format.
 *
 * @param {string} value
 * @returns {string|null}
 */
export const sanitizeObjectId = (value) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  // MongoDB ObjectIds are 24-character hexadecimal strings
  return /^[a-fA-F0-9]{24}$/.test(trimmed) ? trimmed : null;
};

/**
 * Sanitises an object by running sanitizeString on all string values.
 * Does NOT sanitise nested objects.
 *
 * @param {Object} obj - Flat object with string values
 * @returns {Object} Object with all string values trimmed
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== "object" || obj === null) return {};

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "string" ? sanitizeString(value) : value,
    ])
  );
};
