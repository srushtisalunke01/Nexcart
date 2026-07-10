/**
 * @module utils/asyncHandler
 * @description Higher-order function to eliminate try/catch boilerplate
 * in async Express route handlers and middleware.
 *
 * Without asyncHandler:
 *   router.get('/users', async (req, res, next) => {
 *     try {
 *       const users = await userService.getAll();
 *       res.json(users);
 *     } catch (err) {
 *       next(err);  // ← manual boilerplate
 *     }
 *   });
 *
 * With asyncHandler:
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await userService.getAll();
 *     res.json(users);  // ← any thrown error auto-goes to next(err)
 *   }));
 *
 * This ensures ALL async errors are forwarded to the global
 * error middleware without any additional try/catch.
 *
 * Usage:
 *   import asyncHandler from '../utils/asyncHandler.js';
 */

/**
 * Wraps an async Express route handler and automatically passes
 * any rejected promise to Express's next() error handler.
 *
 * @param {Function} fn - Async function (req, res, next) => Promise<void>
 * @returns {Function} Express middleware function with automatic error forwarding
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    // Execute fn and catch any rejections, forwarding them to next()
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
