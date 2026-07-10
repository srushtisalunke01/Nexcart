/**
 * @module config/logger
 * @description Centralised Winston logger configuration.
 *
 * Transports:
 *   - Console   → always active, colorized in development
 *   - File      → logs/error.log (errors only)
 *   - File      → logs/combined.log (all levels)
 *
 * Log levels (ascending severity):
 *   debug < http < info < warn < error
 *
 * Usage:
 *   import logger from './config/logger.js';
 *   logger.info('Server started');
 *   logger.error('Something failed', { error });
 */

import winston from "winston";
import env from "./env.js";

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

// ─── Custom Console Format ───────────────────────────────────────────────────
const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${stack || message}`;

  // Append any extra metadata on a new line for readability
  if (Object.keys(meta).length > 0) {
    log += `\n  ${JSON.stringify(meta, null, 2)}`;
  }

  return log;
});

// ─── Transports ───────────────────────────────────────────────────────────────
const transports = [
  // Error-only file
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Combined file (all levels)
  new winston.transports.File({
    filename: "logs/combined.log",
    maxsize: 10485760, // 10MB
    maxFiles: 10,
  }),
];

// Add colorized console transport in non-production environments
if (!env.IS_PRODUCTION) {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "HH:mm:ss" }),
        errors({ stack: true }),
        consoleFormat
      ),
    })
  );
} else {
  // In production use structured JSON for log aggregation services
  transports.push(
    new winston.transports.Console({
      format: combine(timestamp(), errors({ stack: true }), json()),
    })
  );
}

// ─── Logger Instance ─────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

// ─── Stream for Morgan HTTP Logging ──────────────────────────────────────────
// Morgan will pipe its HTTP logs through Winston at 'http' level
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

export default logger;
