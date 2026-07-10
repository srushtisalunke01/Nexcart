/**
 * @module constants/appConstants
 * @description Application-wide business constants and enums.
 *
 * Contains:
 *   - User role definitions
 *   - Pagination defaults
 *   - File upload limits
 *   - Business rule constants
 *   - Database collection names
 *
 * Usage:
 *   import APP_CONSTANTS from '../constants/appConstants.js';
 *   const { ROLES, PAGINATION } = APP_CONSTANTS;
 */

const APP_CONSTANTS = Object.freeze({

  // ─── Application ─────────────────────────────────────────────
  APP: {
    NAME: "NexCart",
    VERSION: "1.0.0",
    DESCRIPTION: "Premium e-commerce platform",
    SUPPORT_EMAIL: "support@nexcart.com",
  },

  // ─── User Roles ───────────────────────────────────────────────
  // Used in Mongoose schemas, JWT payloads, and RBAC middleware
  ROLES: {
    USER: "user",
    SELLER: "seller",   // Future marketplace seller role
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
  },

  // ─── Pagination ───────────────────────────────────────────────
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 100,
    DEFAULT_SORT: "-createdAt", // Most recent first
  },

  // ─── Password ─────────────────────────────────────────────────
  PASSWORD: {
    BCRYPT_SALT_ROUNDS: 12,
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    RESET_TOKEN_EXPIRY_MS: 10 * 60 * 1000,    // 10 minutes
    RESET_TOKEN_BYTES: 32,
  },

  // ─── Email Verification ───────────────────────────────────────
  EMAIL_VERIFICATION: {
    TOKEN_EXPIRY_MS: 24 * 60 * 60 * 1000,    // 24 hours
    TOKEN_BYTES: 32,
  },

  // ─── Cookie Settings ─────────────────────────────────────────
  COOKIE: {
    ACCESS_TOKEN_MAX_AGE: 15 * 60 * 1000,            // 15 minutes
    REFRESH_TOKEN_MAX_AGE: 7 * 24 * 60 * 60 * 1000,  // 7 days
    HTTP_ONLY: true,
    SAME_SITE: "strict",
    SECURE: true, // Set to false in development (overridden in app.js)
  },

  // ─── File Uploads ─────────────────────────────────────────────
  UPLOAD: {
    MAX_IMAGE_SIZE_MB: 5,
    MAX_PRODUCT_IMAGES: 10,
    SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
    TEMP_DIR: "uploads/temp",
  },

  // ─── Rate Limiting ────────────────────────────────────────────
  RATE_LIMIT: {
    AUTH_WINDOW_MS: 15 * 60 * 1000,  // 15 minutes
    AUTH_MAX_REQUESTS: 10,            // 10 login attempts per window
    API_WINDOW_MS: 15 * 60 * 1000,   // 15 minutes
    API_MAX_REQUESTS: 100,            // 100 requests per window
  },

  // ─── Cart ─────────────────────────────────────────────────────
  CART: {
    MAX_ITEMS: 50,
    MAX_QUANTITY_PER_ITEM: 10,
  },

  // ─── Wishlist ─────────────────────────────────────────────────
  WISHLIST: {
    MAX_ITEMS: 100,
  },

  // ─── Product ──────────────────────────────────────────────────
  PRODUCT: {
    MAX_IMAGES: 10,
    MAX_REVIEWS_PER_PAGE: 20,
    REVIEW_RATING_MIN: 1,
    REVIEW_RATING_MAX: 5,
  },

  // ─── Database Collection Names ────────────────────────────────
  // Explicit collection names prevent Mongoose from pluralising
  COLLECTIONS: {
    USERS: "users",
    PRODUCTS: "products",
    CATEGORIES: "categories",
    ORDERS: "orders",
    CARTS: "carts",
    WISHLISTS: "wishlists",
    REVIEWS: "reviews",
    REFRESH_TOKENS: "refreshTokens",
  },

  // ─── Sort Options ─────────────────────────────────────────────
  SORT: {
    NEWEST: "-createdAt",
    OLDEST: "createdAt",
    PRICE_ASC: "price",
    PRICE_DESC: "-price",
    NAME_ASC: "name",
    NAME_DESC: "-name",
    RATING_DESC: "-averageRating",
    POPULARITY: "-soldCount",
  },

  // ─── Order Status ─────────────────────────────────────────────
  ORDER_STATUS: {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
    FAILED: "failed",
  },

  // ─── Payment Status ───────────────────────────────────────────
  PAYMENT_STATUS: {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded",
    PARTIALLY_REFUNDED: "partially_refunded",
  },
});

export default APP_CONSTANTS;
