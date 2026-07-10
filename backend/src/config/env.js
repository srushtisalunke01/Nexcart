/**
 * @module config/env
 * @description Centralised environment variable validation and export.
 *
 * This module is the single source of truth for all env variables.
 * It validates required variables at application startup and throws
 * a descriptive error if any are missing — implementing "fail-fast".
 *
 * Import env config BEFORE any other module that needs env variables.
 */

import dotenv from "dotenv";

// Load .env file into process.env
dotenv.config();

/**
 * Validates that all required environment variables exist.
 * Throws an Error listing ALL missing variables (not just the first one).
 *
 * @param {string[]} requiredVars - Array of required variable names
 * @throws {Error} If any required variables are missing
 */
const validateEnv = (requiredVars) => {
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[ENV] Missing required environment variables:\n  → ${missing.join("\n  → ")}\n\nPlease check your .env file against .env.example`
    );
  }
};

// ─── Required Variables ──────────────────────────────────────────────────────
// These MUST exist for the application to start.
// Optional variables (e.g. LOG_LEVEL) have defaults below.
validateEnv([
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "COOKIE_SECRET",
]);

// ─── Exported Configuration Object ───────────────────────────────────────────
const env = {
  // Application
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  API_VERSION: process.env.API_VERSION || "v1",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || null,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || null,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || null,

  // Email
  SMTP_HOST: process.env.SMTP_HOST || null,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || null,
  SMTP_PASS: process.env.SMTP_PASS || null,
  EMAIL_FROM: process.env.EMAIL_FROM || "NexCart Support <support@nexcart.com>",

  // CORS
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
    : ["http://localhost:5173", "http://localhost:3000"],

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 min
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,

  // Cookie
  COOKIE_SECRET: process.env.COOKIE_SECRET,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};

export default env;
