/**
 * @module middlewares/errorMiddleware
 * @description Global error handler — the last middleware registered in app.js.
 *
 * Catches all errors passed to next(err) from:
 *   - asyncHandler-wrapped route handlers
 *   - Explicit next(new ApiError(...)) calls
 *   - Mongoose validation / cast errors
 *   - JWT errors
 *   - Unexpected runtime errors
 *
 * Error handling strategy:
 *   - isOperational = true  → Use the error's statusCode and message
 *   - isOperational = false → Log full stack, respond with 500 + generic message
 *   - In production: NEVER expose stack traces to clients
 *
 * MUST be registered as the LAST middleware in app.js.
 */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
import { ApiError } from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import API_MESSAGES from "../constants/apiMessages.js";
import logger from "../config/logger.js";
import env from "../config/env.js";

/**
 * Transforms known error types into ApiError instances.
 * This normalises all errors into a single shape before responding.
 *
 * @param {Error} err - The original error
 * @returns {ApiError} Normalised ApiError
 */
const normaliseError = (err) => {
  // Already an ApiError — pass through
  if (err instanceof ApiError) return err;

  // ─── Mongoose Validation Error ────────────────────────────────
  // Thrown when a Mongoose schema validation fails (e.g. required field missing)
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Validation failed.", errors);
  }

  // ─── Mongoose Cast Error ──────────────────────────────────────
  // Thrown when an invalid ObjectId is passed (e.g. /products/not-a-valid-id)
  if (err instanceof mongoose.Error.CastError) {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Invalid value '${err.value}' for field '${err.path}'.`
    );
  }

  // ─── MongoDB Duplicate Key Error ──────────────────────────────
  // Thrown when a unique index constraint is violated (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue?.[field] || "";
    return new ApiError(
      HTTP_STATUS.CONFLICT,
      `${field} '${value}' already exists. Please use a different value.`
    );
  }

  // ─── JWT Errors ───────────────────────────────────────────────
  if (err instanceof TokenExpiredError) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, API_MESSAGES.AUTH.TOKEN_EXPIRED);
  }

  if (err instanceof JsonWebTokenError) {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, API_MESSAGES.AUTH.TOKEN_INVALID);
  }

  // ─── Multer Errors ────────────────────────────────────────────
  if (err.code === "LIMIT_FILE_SIZE") {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "File size exceeds the allowed limit."
    );
  }
  if (err.code === "LIMIT_FILE_COUNT") {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Too many files uploaded."
    );
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Unexpected file field: '${err.field}'.`
    );
  }

  // ─── Unknown / Programmer Error ───────────────────────────────
  // Log the full error for debugging but send a generic message to client
  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.GENERIC.INTERNAL_ERROR
  );
};

/**
 * Global error handling middleware.
 * Express identifies error handlers by their 4-argument signature (err, req, res, next).
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next - Required even if unused (Express 4 convention)
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const apiError = normaliseError(err);

  // Log all errors — include stack for non-operational errors
  if (!apiError.isOperational || apiError.statusCode >= 500) {
    logger.error(`[Error] ${apiError.message}`, {
      statusCode: apiError.statusCode,
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    });
  } else {
    logger.warn(`[Error] ${apiError.message}`, {
      statusCode: apiError.statusCode,
      path: req.originalUrl,
    });
  }

  // Build the response body
  const responseBody = {
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    data: null,
    errors: apiError.errors?.length > 0 ? apiError.errors : null,
  };

  // Only include stack trace in development
  if (env.IS_DEVELOPMENT && err.stack) {
    responseBody.stack = err.stack;
  }

  return res.status(apiError.statusCode).json(responseBody);
};

export default errorMiddleware;
