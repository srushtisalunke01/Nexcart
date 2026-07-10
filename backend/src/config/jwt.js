/**
 * @module config/jwt
 * @description Centralised JWT token generation and verification helpers.
 *
 * Responsibilities:
 *   - Generate Access Tokens (short-lived, sent in Authorization header)
 *   - Generate Refresh Tokens (long-lived, stored in httpOnly cookie)
 *   - Verify tokens and return decoded payloads
 *   - Centralise all token expiration configuration
 *
 * Security notes:
 *   - Secrets are never hardcoded — always read from env
 *   - Token payload contains only necessary claims (userId, role)
 *   - Never include sensitive data (passwords, PII) in tokens
 *
 * Usage:
 *   import { generateAccessToken, verifyAccessToken } from './config/jwt.js';
 */

import jwt from "jsonwebtoken";
import env from "./env.js";

// ─── Token Configuration ──────────────────────────────────────────────────────
export const TOKEN_CONFIG = {
  access: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN, // default: "15m"
    cookieName: "nexcart_access_token",
  },
  refresh: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN, // default: "7d"
    cookieName: "nexcart_refresh_token",
  },
};

/**
 * Generates a short-lived access token.
 *
 * @param {Object} payload - Data to encode in the token
 * @param {string} payload.userId - MongoDB ObjectId of the user
 * @param {string} payload.role - User role (user | admin | seller)
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, TOKEN_CONFIG.access.secret, {
    expiresIn: TOKEN_CONFIG.access.expiresIn,
    issuer: "nexcart-api",
    audience: "nexcart-client",
  });
};

/**
 * Generates a long-lived refresh token.
 *
 * @param {Object} payload - Data to encode in the token
 * @param {string} payload.userId - MongoDB ObjectId of the user
 * @returns {string} Signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, TOKEN_CONFIG.refresh.secret, {
    expiresIn: TOKEN_CONFIG.refresh.expiresIn,
    issuer: "nexcart-api",
    audience: "nexcart-client",
  });
};

/**
 * Verifies an access token and returns its decoded payload.
 *
 * @param {string} token - The access token to verify
 * @returns {Object} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid
 * @throws {jwt.TokenExpiredError} If token is expired
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, TOKEN_CONFIG.access.secret, {
    issuer: "nexcart-api",
    audience: "nexcart-client",
  });
};

/**
 * Verifies a refresh token and returns its decoded payload.
 *
 * @param {string} token - The refresh token to verify
 * @returns {Object} Decoded token payload
 * @throws {jwt.JsonWebTokenError} If token is invalid
 * @throws {jwt.TokenExpiredError} If token is expired
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, TOKEN_CONFIG.refresh.secret, {
    issuer: "nexcart-api",
    audience: "nexcart-client",
  });
};

/**
 * Decodes a token WITHOUT verifying its signature.
 * Useful for reading an expired token's payload to identify the user.
 * Do NOT use for authentication — this does not verify signature.
 *
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded payload or null if malformed
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
