/**
 * @module middlewares/validationMiddleware
 * @description express-validator result handler middleware.
 *
 * This middleware is placed AFTER validator chains in routes.
 * It checks the validation result and, if there are errors,
 * throws an ApiError(422) with field-level error details.
 *
 * Usage in routes:
 *   import { validate } from '../middlewares/validationMiddleware.js';
 *   import { registerValidators } from '../validators/authValidators.js';
 *
 *   router.post('/register',
 *     registerValidators,   // express-validator chains
 *     validate,             // this middleware checks results
 *     registerController    // only called if validation passes
 *   );
 */

import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import API_MESSAGES from "../constants/apiMessages.js";

/**
 * Reads the express-validator result for the current request.
 * If validation errors exist, throws ApiError(422) with structured errors.
 * If validation passes, calls next() to proceed to the controller.
 *
 * Error shape passed to client:
 *   errors: [
 *     { field: "email", message: "Invalid email format" },
 *     { field: "password", message: "Password must be at least 8 characters" }
 *   ]
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const validate = (req, _res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    // Map express-validator errors to our standard { field, message } shape
    const errors = result.array().map((err) => ({
      field: err.path || err.param || "unknown",
      message: err.msg,
    }));

    return next(
      new ApiError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        API_MESSAGES.GENERIC.VALIDATION_FAILED,
        errors
      )
    );
  }

  next();
};
