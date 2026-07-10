/**
 * @module constants/apiMessages
 * @description Centralised API response messages.
 *
 * Centralising messages ensures:
 *   - Consistent wording across all endpoints
 *   - Easy internationalisation (i18n) in the future
 *   - No duplicate strings scattered across controllers
 *
 * Usage:
 *   import API_MESSAGES from '../constants/apiMessages.js';
 *   return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.AUTH.LOGIN_SUCCESS, data);
 */

const API_MESSAGES = Object.freeze({
  // ─── Generic ─────────────────────────────────────────────────
  GENERIC: {
    SUCCESS: "Request completed successfully.",
    CREATED: "Resource created successfully.",
    UPDATED: "Resource updated successfully.",
    DELETED: "Resource deleted successfully.",
    NOT_FOUND: "The requested resource was not found.",
    BAD_REQUEST: "Invalid request. Please check your input.",
    UNAUTHORIZED: "Authentication required. Please log in.",
    FORBIDDEN: "You do not have permission to perform this action.",
    CONFLICT: "A resource with this information already exists.",
    VALIDATION_FAILED: "Validation failed. Please check the errors and try again.",
    INTERNAL_ERROR: "An unexpected error occurred. Please try again later.",
    TOO_MANY_REQUESTS: "Too many requests. Please wait before trying again.",
  },

  // ─── Authentication (Phase 1B) ────────────────────────────────
  AUTH: {
    REGISTER_SUCCESS: "Account created successfully. Welcome to NexCart!",
    LOGIN_SUCCESS: "Logged in successfully. Welcome back!",
    LOGOUT_SUCCESS: "Logged out successfully.",
    TOKEN_REFRESHED: "Access token refreshed successfully.",
    TOKEN_INVALID: "Invalid or malformed token.",
    TOKEN_EXPIRED: "Session expired. Please log in again.",
    TOKEN_MISSING: "Authentication token is required.",
    PASSWORD_CHANGED: "Password changed successfully.",
    PASSWORD_RESET_SENT: "Password reset link sent to your email.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully.",
    EMAIL_VERIFIED: "Email verified successfully.",
    EMAIL_ALREADY_VERIFIED: "Your email is already verified.",
    VERIFICATION_EMAIL_SENT: "Verification email sent. Please check your inbox.",
    INVALID_CREDENTIALS: "Invalid email or password.",
    ACCOUNT_DISABLED: "Your account has been disabled. Please contact support.",
  },

  // ─── User (Phase 1B) ─────────────────────────────────────────
  USER: {
    PROFILE_FETCHED: "Profile fetched successfully.",
    PROFILE_UPDATED: "Profile updated successfully.",
    AVATAR_UPDATED: "Avatar updated successfully.",
    ADDRESSES_FETCHED: "Addresses fetched successfully.",
    ADDRESS_ADDED: "Address added successfully.",
    ADDRESS_UPDATED: "Address updated successfully.",
    ADDRESS_DELETED: "Address deleted successfully.",
    ADDRESS_NOT_FOUND: "Address not found.",
  },

  // ─── Products (Phase 1C) ──────────────────────────────────────
  PRODUCT: {
    FETCHED: "Products fetched successfully.",
    SINGLE_FETCHED: "Product fetched successfully.",
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
    NOT_FOUND: "Product not found.",
    OUT_OF_STOCK: "This product is currently out of stock.",
    IMAGES_UPLOADED: "Product images uploaded successfully.",
  },

  // ─── Cart (Phase 1D) ─────────────────────────────────────────
  CART: {
    FETCHED: "Cart fetched successfully.",
    ITEM_ADDED: "Item added to cart.",
    ITEM_UPDATED: "Cart item updated.",
    ITEM_REMOVED: "Item removed from cart.",
    CLEARED: "Cart cleared.",
    EMPTY: "Your cart is empty.",
  },

  // ─── Wishlist (Phase 1D) ──────────────────────────────────────
  WISHLIST: {
    FETCHED: "Wishlist fetched successfully.",
    ITEM_ADDED: "Item added to wishlist.",
    ITEM_REMOVED: "Item removed from wishlist.",
  },

  // ─── Orders (Phase 1E) ───────────────────────────────────────
  ORDER: {
    FETCHED: "Orders fetched successfully.",
    SINGLE_FETCHED: "Order fetched successfully.",
    PLACED: "Order placed successfully.",
    CANCELLED: "Order cancelled successfully.",
    NOT_FOUND: "Order not found.",
  },

  // ─── Health ──────────────────────────────────────────────────
  HEALTH: {
    OK: "NexCart API is healthy and running.",
    DB_CONNECTED: "Database connection is active.",
    DB_DISCONNECTED: "Database connection is not available.",
  },
});

export default API_MESSAGES;
