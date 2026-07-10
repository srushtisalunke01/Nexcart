/**
 * @module middlewares/requestLogger
 * @description HTTP request logging middleware using Morgan + Winston.
 *
 * Morgan generates structured HTTP log entries for every request.
 * Log output is piped to the Winston logger at 'http' level via
 * the stream adapter defined in config/logger.js.
 *
 * Format:
 *   Development → concise colourized output
 *   Production  → detailed combined format for log aggregation
 *
 * Usage (in app.js):
 *   import requestLogger from './middlewares/requestLogger.js';
 *   app.use(requestLogger);
 */

import morgan from "morgan";
import logger from "../config/logger.js";
import env from "../config/env.js";

// ─── Custom Token: Request ID ─────────────────────────────────────────────────
// Adds a unique request ID to each log line for distributed tracing.
morgan.token("request-id", (req) => req.id || "-");

// ─── Custom Token: User ID ────────────────────────────────────────────────────
// Logs the authenticated user's ID if available (set by authMiddleware).
morgan.token("user-id", (req) => req.user?.userId || "guest");

// ─── Format Strings ───────────────────────────────────────────────────────────
const DEVELOPMENT_FORMAT =
  ":method :url :status :res[content-length] - :response-time ms";

const PRODUCTION_FORMAT =
  ':remote-addr - :user-id ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// ─── Skip Function ────────────────────────────────────────────────────────────
// Skip logging for health check endpoints to reduce noise
const skipHealthCheck = (req) => req.originalUrl === "/api/v1/health";

// ─── Morgan Middleware Instance ───────────────────────────────────────────────
const requestLogger = morgan(
  env.IS_PRODUCTION ? PRODUCTION_FORMAT : DEVELOPMENT_FORMAT,
  {
    stream: logger.stream,
    skip: skipHealthCheck,
  }
);

export default requestLogger;
