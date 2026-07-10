/**
 * @module utils/ApiResponse
 * @description Standardised API response builder.
 *
 * Enforces a consistent response envelope across ALL endpoints:
 *
 * Success:
 *   { success: true,  statusCode: 200, message: "...", data: {...}, errors: null }
 *
 * Error (via ApiError + errorMiddleware):
 *   { success: false, statusCode: 400, message: "...", data: null,  errors: [...] }
 *
 * Controllers use this class to send responses:
 *   return new ApiResponse(HTTP_STATUS.OK, 'User fetched', user).send(res);
 *   — OR —
 *   res.status(200).json(new ApiResponse(200, 'User fetched', user));
 *
 * Usage:
 *   import { ApiResponse } from '../utils/ApiResponse.js';
 */

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable success message
   * @param {*}      [data=null] - Response payload (object, array, or null)
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data ?? null;
    this.errors = null;
  }

  /**
   * Sends the response using the Express Response object.
   * This is the preferred way to respond from a controller.
   *
   * @param {import('express').Response} res - Express response object
   * @returns {import('express').Response}
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
    });
  }

  // ─── Static Factory Methods ──────────────────────────────────────────────

  /**
   * Creates a 200 OK response.
   *
   * @param {string} message
   * @param {*} [data]
   * @returns {ApiResponse}
   */
  static ok(message, data = null) {
    return new ApiResponse(200, message, data);
  }

  /**
   * Creates a 201 Created response.
   *
   * @param {string} message
   * @param {*} [data]
   * @returns {ApiResponse}
   */
  static created(message, data = null) {
    return new ApiResponse(201, message, data);
  }

  /**
   * Creates a 204 No Content response.
   * Note: 204 sends no body by HTTP spec.
   *
   * @param {import('express').Response} res
   * @returns {import('express').Response}
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

export { ApiResponse };
