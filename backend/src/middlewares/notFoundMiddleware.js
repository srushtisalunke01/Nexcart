/**
 * @module middlewares/notFoundMiddleware
 * @description Catch-all 404 handler for unmatched routes.
 *
 * Registered AFTER all route definitions in app.js.
 * If no route matched the request, this middleware fires and
 * passes a 404 ApiError to the global error handler.
 *
 * Usage (in app.js — after all routes):
 *   import notFoundMiddleware from './middlewares/notFoundMiddleware.js';
 *   app.use(notFoundMiddleware);
 *   app.use(errorMiddleware); // error handler must come after this
 */

import { ApiError } from "../utils/ApiError.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * Handles requests that did not match any registered route.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
const notFoundMiddleware = (req, _res, next) => {
  next(
    new ApiError(
      HTTP_STATUS.NOT_FOUND,
      `Route not found: ${req.method} ${req.originalUrl}`
    )
  );
};

export default notFoundMiddleware;
