/**
 * @module middlewares/adminMiddleware
 * @description Role-Based Access Control (RBAC) middleware.
 *
 * Must be used AFTER the protect middleware, since it reads req.user
 * which is set by protect.
 *
 * Usage:
 *   import { protect } from './authMiddleware.js';
 *   import { requireRole, requireAdmin } from './adminMiddleware.js';
 *
 *   // Only admins:
 *   router.delete('/products/:id', protect, requireAdmin, deleteProduct);
 *
 *   // Admin or Super Admin:
 *   router.get('/stats', protect, requireRole(['admin', 'super_admin']), getStats);
 *
 *   // Seller or Admin:
 *   router.post('/products', protect, requireRole(['seller', 'admin']), createProduct);
 */

import { ApiError } from "../utils/ApiError.js";
import API_MESSAGES from "../constants/apiMessages.js";
import APP_CONSTANTS from "../constants/appConstants.js";

const { ROLES } = APP_CONSTANTS;

/**
 * Creates a middleware that allows only users with specified roles.
 *
 * @param {string[]} allowedRoles - Array of roles that can access this route
 * @returns {Function} Express middleware
 *
 * @example
 * requireRole(['admin', 'super_admin'])
 */
export const requireRole = (allowedRoles) => {
  return (req, _res, next) => {
    // Guard: ensure protect middleware ran first
    if (!req.user) {
      return next(ApiError.unauthorized(API_MESSAGES.GENERIC.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden(API_MESSAGES.GENERIC.FORBIDDEN));
    }

    next();
  };
};

/**
 * Convenience middleware: allows only ADMIN and SUPER_ADMIN roles.
 * Equivalent to requireRole(['admin', 'super_admin']).
 */
export const requireAdmin = requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]);

/**
 * Convenience middleware: allows only SUPER_ADMIN role.
 * For highly sensitive operations (e.g., deleting a user's entire account data).
 */
export const requireSuperAdmin = requireRole([ROLES.SUPER_ADMIN]);

/**
 * Convenience middleware: allows SELLER, ADMIN, and SUPER_ADMIN roles.
 * For product management actions in the marketplace phase.
 */
export const requireSeller = requireRole([ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]);

/**
 * Ownership check middleware factory.
 * Ensures the authenticated user owns the resource, OR is an admin.
 *
 * @param {Function} getResourceOwnerId - Async fn(req) => string (owner's userId)
 * @returns {Function} Express middleware
 *
 * @example
 * // Only the order owner or an admin can cancel it:
 * router.delete('/orders/:id', protect, requireOwnerOrAdmin(
 *   async (req) => {
 *     const order = await orderRepository.findById(req.params.id);
 *     return order?.userId?.toString();
 *   }
 * ), cancelOrder);
 */
export const requireOwnerOrAdmin = (getResourceOwnerId) => {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        return next(ApiError.unauthorized(API_MESSAGES.GENERIC.UNAUTHORIZED));
      }

      // Admins bypass ownership check
      if ([ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(req.user.role)) {
        return next();
      }

      const ownerId = await getResourceOwnerId(req);

      if (!ownerId || ownerId.toString() !== req.user.userId.toString()) {
        return next(ApiError.forbidden(API_MESSAGES.GENERIC.FORBIDDEN));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
