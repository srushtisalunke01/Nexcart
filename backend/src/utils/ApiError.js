/**
 * @module utils/ApiError
 * @description Custom error class for operational API errors.
 *
 * Distinguishes between two types of errors:
 *
 *   isOperational = true  → User-facing errors (validation, not-found, etc.)
 *                           → Show error message to client
 *
 *   isOperational = false → Programmer errors (bugs, unexpected failures)
 *                           → Log full stack, send generic "Internal Server Error" to client
 *
 * Usage:
 *   throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Product not found');
 *   throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', validationErrors);
 */

import HTTP_STATUS from "../constants/httpStatus.js";

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (use HTTP_STATUS constants)
   * @param {string} message - Human-readable error description
   * @param {Array}  [errors=[]] - Optional array of field-level validation errors
   * @param {string} [stack=''] - Optional custom stack trace (auto-captured if omitted)
   */
  constructor(
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message = "An unexpected error occurred.",
    errors = [],
    stack = ""
  ) {
    // Call Error constructor to set message
    super(message);

    // HTTP status code to send in the response
    this.statusCode = statusCode;

    // success is always false for errors
    this.success = false;

    // Array of field-level errors (from express-validator, etc.)
    // Shape: [{ field: 'email', message: 'Invalid email format' }]
    this.errors = errors;

    // isOperational = true means this is a KNOWN, EXPECTED error that
    // the application deliberately threw (e.g., "user not found").
    // isOperational = false means something unexpected happened (bug).
    this.isOperational = true;

    // Capture or use the provided stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ─── Static Factory Methods ──────────────────────────────────────────────
  // Convenience methods for the most common error types

  /** 400 Bad Request */
  static badRequest(message, errors = []) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, errors);
  }

  /** 401 Unauthorized */
  static unauthorized(message = "Authentication required.") {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  /** 403 Forbidden */
  static forbidden(message = "You do not have permission to perform this action.") {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  /** 404 Not Found */
  static notFound(resource = "Resource") {
    return new ApiError(HTTP_STATUS.NOT_FOUND, `${resource} not found.`);
  }

  /** 409 Conflict */
  static conflict(message) {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  /** 422 Unprocessable Entity */
  static unprocessable(message, errors = []) {
    return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message, errors);
  }

  /** 429 Too Many Requests */
  static tooManyRequests(message = "Too many requests. Please try again later.") {
    return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message);
  }

  /** 500 Internal Server Error */
  static internal(message = "An unexpected error occurred.") {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
  }
}

export { ApiError };
