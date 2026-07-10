/**
 * @module helpers/paginationHelper
 * @description Pagination utilities for list endpoints.
 *
 * Provides:
 *   - Consistent query parameter parsing (page, limit, sort)
 *   - Mongoose query building (skip, limit)
 *   - Standardised pagination metadata in responses
 *
 * Usage:
 *   import { parsePaginationQuery, buildPaginationMeta } from './paginationHelper.js';
 *
 *   // In repository:
 *   const { page, limit, skip, sort } = parsePaginationQuery(req.query);
 *   const docs = await Model.find(filter).sort(sort).skip(skip).limit(limit);
 *   const total = await Model.countDocuments(filter);
 *   const meta = buildPaginationMeta(total, page, limit);
 */

import APP_CONSTANTS from "../constants/appConstants.js";

const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT, DEFAULT_SORT } = APP_CONSTANTS.PAGINATION;

/**
 * Parses and sanitises pagination query parameters from the request.
 *
 * @param {Object} query - req.query object
 * @param {string|number} [query.page] - Page number (1-indexed)
 * @param {string|number} [query.limit] - Items per page
 * @param {string} [query.sort] - Mongoose sort string (e.g. '-createdAt', 'price')
 * @returns {{ page: number, limit: number, skip: number, sort: string }}
 */
export const parsePaginationQuery = (query = {}) => {
  // Parse and clamp page to a positive integer
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);

  // Parse and clamp limit between 1 and MAX_LIMIT
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT)
  );

  // Calculate how many documents to skip
  const skip = (page - 1) * limit;

  // Whitelist allowed sort fields to prevent arbitrary key injection
  const allowedSortValues = Object.values(APP_CONSTANTS.SORT);
  const sort = allowedSortValues.includes(query.sort) ? query.sort : DEFAULT_SORT;

  return { page, limit, skip, sort };
};

/**
 * Builds standardised pagination metadata for list responses.
 *
 * @param {number} total - Total number of documents matching the query
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 *
 * @example
 * {
 *   total: 150,
 *   page: 2,
 *   limit: 12,
 *   totalPages: 13,
 *   hasNextPage: true,
 *   hasPrevPage: true,
 *   nextPage: 3,
 *   prevPage: 1
 * }
 */
export const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
};

/**
 * Wraps a list result with pagination metadata into a standardised shape.
 *
 * @param {Array} items - Array of documents
 * @param {number} total - Total document count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated response object
 *
 * @example
 * { items: [...], pagination: { total: 150, page: 2, ... } }
 */
export const paginatedResponse = (items, total, page, limit) => {
  return {
    items,
    pagination: buildPaginationMeta(total, page, limit),
  };
};
