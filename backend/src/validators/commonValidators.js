/**
 * @module validators/commonValidators
 * @description Shared express-validator rule chains used across multiple domains.
 *
 * Domain-specific validators (authValidators, productValidators, etc.)
 * will be added in their respective phases and will import from here.
 *
 * Usage:
 *   import { mongoIdParam, emailField, passwordField } from '../validators/commonValidators.js';
 *
 *   // In a route file:
 *   router.get('/:id', mongoIdParam('id'), validate, getById);
 *
 *   // In an auth validator file:
 *   export const loginValidators = [emailField, passwordField];
 */

import { body, param, query } from "express-validator";

// ─── MongoDB ObjectId Validators ──────────────────────────────────────────────

/**
 * Validates a MongoDB ObjectId in route params.
 *
 * @param {string} [paramName='id'] - The parameter name to validate
 * @returns {ValidationChain}
 *
 * @example
 * router.get('/:id', mongoIdParam('id'), validate, getProduct);
 */
export const mongoIdParam = (paramName = "id") =>
  param(paramName)
    .trim()
    .notEmpty()
    .withMessage(`${paramName} is required.`)
    .isMongoId()
    .withMessage(`${paramName} must be a valid resource ID.`);

/**
 * Validates a MongoDB ObjectId in request body.
 *
 * @param {string} fieldName - The body field name to validate
 * @returns {ValidationChain}
 */
export const mongoIdBody = (fieldName) =>
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} is required.`)
    .isMongoId()
    .withMessage(`${fieldName} must be a valid resource ID.`);

// ─── Common Field Validators ──────────────────────────────────────────────────

/**
 * Validates an email address in the request body.
 * - Must be non-empty
 * - Must be a valid email format
 * - Normalised to lowercase
 */
export const emailField = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required.")
  .isEmail()
  .withMessage("Please provide a valid email address.")
  .normalizeEmail();

/**
 * Validates a password in the request body.
 * - Must be non-empty
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - Must contain at least one uppercase, one lowercase, and one digit
 */
export const passwordField = body("password")
  .notEmpty()
  .withMessage("Password is required.")
  .isLength({ min: 8, max: 128 })
  .withMessage("Password must be between 8 and 128 characters.")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, and one number."
  );

/**
 * Validates a name field (first name, last name, product name, etc.)
 *
 * @param {string} fieldName - The body field name to validate
 * @param {number} [min=2] - Minimum length
 * @param {number} [max=100] - Maximum length
 * @returns {ValidationChain}
 */
export const nameField = (fieldName, min = 2, max = 100) =>
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`${fieldName} is required.`)
    .isLength({ min, max })
    .withMessage(`${fieldName} must be between ${min} and ${max} characters.`)
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes.`);

/**
 * Validates a phone number in the request body.
 * Accepts international format with optional +, spaces, and dashes.
 *
 * @param {string} [fieldName='phone'] - The body field name
 * @returns {ValidationChain}
 */
export const phoneField = (fieldName = "phone") =>
  body(fieldName)
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-().]{7,20}$/)
    .withMessage("Please provide a valid phone number.");

/**
 * Validates a price field (must be a positive number).
 *
 * @param {string} fieldName - The body field name
 * @returns {ValidationChain}
 */
export const priceField = (fieldName) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required.`)
    .isFloat({ min: 0 })
    .withMessage(`${fieldName} must be a positive number.`);

/**
 * Validates a non-negative integer quantity field.
 *
 * @param {string} [fieldName='quantity'] - The body field name
 * @returns {ValidationChain}
 */
export const quantityField = (fieldName = "quantity") =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required.`)
    .isInt({ min: 1, max: 1000 })
    .withMessage(`${fieldName} must be a whole number between 1 and 1000.`);

// ─── Pagination Query Validators ─────────────────────────────────────────────

/**
 * Validates pagination query parameters (page, limit, sort).
 * All are optional — defaults are applied in paginationHelper.
 */
export const paginationQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer."),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100."),

  query("sort")
    .optional()
    .isString()
    .withMessage("sort must be a string."),
];
