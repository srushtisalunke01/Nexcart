/**
 * @module interfaces/common.interfaces
 * @description JSDoc typedef definitions for common object shapes.
 *
 * JavaScript doesn't have interfaces, but JSDoc typedefs provide
 * the same documentation and editor autocomplete benefits.
 *
 * These typedefs define the "contracts" between layers:
 *   - What shape a Controller receives from a Service
 *   - What shape a Repository returns to a Service
 *   - What shape an API response sends to the client
 *
 * Usage (in JSDoc comments of other files):
 *   @param {PaginatedResult} result
 *   @returns {ApiResponseShape}
 */

/**
 * @typedef {Object} ApiResponseShape
 * @description Standard API response envelope shape.
 * @property {boolean} success - Whether the request succeeded
 * @property {number} statusCode - HTTP status code
 * @property {string} message - Human-readable response message
 * @property {*} data - Response payload (null for errors)
 * @property {FieldError[]|null} errors - Validation errors (null for success)
 */

/**
 * @typedef {Object} FieldError
 * @description Field-level validation error shape.
 * @property {string} field - The name of the invalid field
 * @property {string} message - Description of why validation failed
 */

/**
 * @typedef {Object} PaginationMeta
 * @description Pagination metadata included in list responses.
 * @property {number} total - Total number of matching documents
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Items per page
 * @property {number} totalPages - Total number of pages
 * @property {boolean} hasNextPage - Whether there is a next page
 * @property {boolean} hasPrevPage - Whether there is a previous page
 * @property {number|null} nextPage - Next page number or null
 * @property {number|null} prevPage - Previous page number or null
 */

/**
 * @typedef {Object} PaginatedResult
 * @description Standardised paginated response shape for list endpoints.
 * @property {Array} items - Array of documents for the current page
 * @property {PaginationMeta} pagination - Pagination metadata
 */

/**
 * @typedef {Object} PaginationQuery
 * @description Parsed pagination parameters from request query.
 * @property {number} page - Current page number
 * @property {number} limit - Items per page
 * @property {number} skip - Number of documents to skip
 * @property {string} sort - Mongoose sort string
 */

/**
 * @typedef {Object} TokenPayload
 * @description Shape of the data encoded in JWT access tokens.
 * @property {string} userId - MongoDB ObjectId of the user as string
 * @property {string} role - User role (user | seller | admin | super_admin)
 * @property {number} iat - Issued at timestamp (seconds since epoch)
 * @property {number} exp - Expiry timestamp (seconds since epoch)
 * @property {string} iss - Issuer claim ("nexcart-api")
 * @property {string} aud - Audience claim ("nexcart-client")
 */

/**
 * @typedef {Object} FileUploadResult
 * @description Shape of the Cloudinary upload result stored in the database.
 * @property {string} url - HTTPS URL of the uploaded file
 * @property {string} publicId - Cloudinary public ID (needed for deletion)
 * @property {string} [format] - File format (jpg, png, webp, etc.)
 * @property {number} [width] - Image width in pixels
 * @property {number} [height] - Image height in pixels
 */

/**
 * @typedef {Object} ServiceResult
 * @description Generic result shape returned from service layer methods.
 * @property {boolean} success - Whether the operation succeeded
 * @property {*} [data] - Result data (present on success)
 * @property {string} [message] - Optional descriptive message
 */

// This file is documentation-only and exports nothing at runtime.
export {};
