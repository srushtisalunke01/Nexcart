/**
 * @module types/roles.types
 * @description User role type definitions and role hierarchy constants.
 *
 * These are the canonical role values used in:
 *   - Mongoose User schema (enum validation)
 *   - JWT payload (role claim)
 *   - RBAC middleware (requireRole checks)
 *   - Admin dashboard filters
 *
 * Role hierarchy (lowest to highest privilege):
 *   USER < SELLER < ADMIN < SUPER_ADMIN
 *
 * Usage:
 *   import { ROLES, ROLE_HIERARCHY, hasMinimumRole } from '../types/roles.types.js';
 */

/**
 * Canonical role string values.
 * Use these constants instead of hardcoding role strings.
 */
export const ROLES = Object.freeze({
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
});

/**
 * All valid role values as an array.
 * Useful for Mongoose schema enum validation.
 *
 * @type {string[]}
 */
export const ALL_ROLES = Object.values(ROLES);

/**
 * Role hierarchy — higher number = higher privilege.
 * Used to implement "minimum role" checks.
 *
 * @type {Object.<string, number>}
 */
export const ROLE_HIERARCHY = Object.freeze({
  [ROLES.USER]: 1,
  [ROLES.SELLER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
});

/**
 * Checks if a given role meets a minimum required privilege level.
 *
 * @param {string} userRole - The user's actual role
 * @param {string} minimumRole - The minimum required role
 * @returns {boolean} True if userRole has at least the privilege of minimumRole
 *
 * @example
 * hasMinimumRole('admin', 'seller')     // true  (admin > seller)
 * hasMinimumRole('user', 'seller')      // false (user < seller)
 * hasMinimumRole('admin', 'admin')      // true  (equal)
 */
export const hasMinimumRole = (userRole, minimumRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  const minimumLevel = ROLE_HIERARCHY[minimumRole] ?? 0;
  return userLevel >= minimumLevel;
};

/**
 * Checks if a role is a privileged role (admin or super_admin).
 *
 * @param {string} role
 * @returns {boolean}
 */
export const isPrivilegedRole = (role) => {
  return [ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(role);
};
