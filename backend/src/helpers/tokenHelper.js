/**
 * @module helpers/tokenHelper
 * @description JWT token extraction helpers for auth middleware.
 *
 * Supports two token delivery strategies:
 *   1. Authorization header: "Bearer <token>"
 *   2. HttpOnly cookie: req.cookies.nexcart_access_token
 *
 * The middleware checks the header first, then falls back to cookie.
 * This supports both browser clients (cookies) and API clients (headers).
 *
 * Usage:
 *   import { extractAccessToken, extractRefreshToken } from './tokenHelper.js';
 *   const token = extractAccessToken(req);
 */

import { TOKEN_CONFIG } from "../config/jwt.js";

/**
 * Extracts the access token from the request.
 * Checks Authorization header first, then falls back to cookie.
 *
 * @param {import('express').Request} req - Express request object
 * @returns {string|null} The raw JWT token string or null if not found
 */
export const extractAccessToken = (req) => {
  // Strategy 1: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  // Strategy 2: HttpOnly cookie
  if (req.cookies && req.cookies[TOKEN_CONFIG.access.cookieName]) {
    return req.cookies[TOKEN_CONFIG.access.cookieName];
  }

  return null;
};

/**
 * Extracts the refresh token from the request.
 * Refresh tokens are only stored in httpOnly cookies for security.
 *
 * @param {import('express').Request} req - Express request object
 * @returns {string|null} The raw refresh token or null if not found
 */
export const extractRefreshToken = (req) => {
  if (req.cookies && req.cookies[TOKEN_CONFIG.refresh.cookieName]) {
    return req.cookies[TOKEN_CONFIG.refresh.cookieName];
  }
  return null;
};

/**
 * Sets the access token as an httpOnly cookie on the response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {string} token - The signed access token
 * @param {boolean} [isProduction=false] - Whether to set Secure flag
 */
export const setAccessTokenCookie = (res, token, isProduction = false) => {
  res.cookie(TOKEN_CONFIG.access.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });
};

/**
 * Sets the refresh token as an httpOnly cookie on the response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {string} token - The signed refresh token
 * @param {boolean} [isProduction=false] - Whether to set Secure flag
 */
export const setRefreshTokenCookie = (res, token, isProduction = false) => {
  res.cookie(TOKEN_CONFIG.refresh.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};

/**
 * Clears both access and refresh token cookies.
 * Called during logout.
 *
 * @param {import('express').Response} res - Express response object
 */
export const clearAuthCookies = (res) => {
  res.clearCookie(TOKEN_CONFIG.access.cookieName);
  res.clearCookie(TOKEN_CONFIG.refresh.cookieName);
};
