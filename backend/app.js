/**
 * @module app
 * @description Express application factory.
 *
 * This file is responsible for:
 *   1. Initialising the Express application
 *   2. Applying all global middleware (in correct order)
 *   3. Mounting all API routes
 *   4. Registering the 404 and global error handlers
 *
 * This file does NOT start the HTTP server — that is server.js's job.
 * This separation allows the app to be imported in tests without
 * binding to a port.
 *
 * Middleware order matters in Express:
 *   Security → Parsing → Compression → Logging → Routes → 404 → Error
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import env from "./src/config/env.js";
import logger from "./src/config/logger.js";
import apiRouter from "./src/routes/index.js";
import requestLogger from "./src/middlewares/requestLogger.js";
import notFoundMiddleware from "./src/middlewares/notFoundMiddleware.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";
import APP_CONSTANTS from "./src/constants/appConstants.js";

// ─── App Initialisation ───────────────────────────────────────────────────────
const app = express();

// ─── 1. Trust Proxy ───────────────────────────────────────────────────────────
// Required when deployed behind a reverse proxy (Nginx, Render, Heroku, etc.)
// Enables correct client IP extraction for rate limiting.
if (env.IS_PRODUCTION) {
  app.set("trust proxy", 1);
}

// ─── 2. Security Middleware ───────────────────────────────────────────────────

// Helmet sets security-related HTTP headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Allow embeddable content (product images)
    contentSecurityPolicy: env.IS_PRODUCTION
      ? undefined // Use Helmet's defaults in production
      : false,    // Disable CSP in development for easier debugging
  })
);

// CORS — whitelist frontend origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (env.CORS_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      logger.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error(`Origin '${origin}' is not allowed by CORS policy.`));
    },
    credentials: true, // Allow cookies in cross-origin requests
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// NoSQL Injection prevention — strips $ and . from req.body, params, query
app.use(mongoSanitize());

// ─── 3. Global Rate Limiter ───────────────────────────────────────────────────
// Applied to all /api routes — individual auth routes have tighter limits
const apiLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMIT.API_WINDOW_MS,
  max: APP_CONSTANTS.RATE_LIMIT.API_MAX_REQUESTS,
  standardHeaders: true,  // Return rate limit info in RateLimit-* headers
  legacyHeaders: false,   // Disable deprecated X-RateLimit-* headers
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
    data: null,
    errors: null,
  },
  skip: (req) => req.originalUrl === "/api/v1/health", // Don't rate-limit health checks
});

app.use("/api", apiLimiter);

// ─── 4. Compression ───────────────────────────────────────────────────────────
// Compresses responses > 1KB using gzip
app.use(compression());

// ─── 5. Body Parsing ─────────────────────────────────────────────────────────
// Parse JSON bodies — limit to 10kb to prevent large payload attacks
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Parse cookies (required for httpOnly token cookies)
app.use(cookieParser(env.COOKIE_SECRET));

// ─── 6. Request Logging ──────────────────────────────────────────────────────
app.use(requestLogger);

// ─── 7. API Routes ───────────────────────────────────────────────────────────
// All routes are namespaced under /api/v{version}
app.use(`/api/${env.API_VERSION}`, apiRouter);

// ─── 8. Root Endpoint ────────────────────────────────────────────────────────
// Simple acknowledgement for requests to the base URL
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: `Welcome to NexCart API. Visit /api/${env.API_VERSION}/health for status.`,
    documentation: `/api/${env.API_VERSION}/docs`,
  });
});

// ─── 9. 404 Handler ──────────────────────────────────────────────────────────
// Must be after all routes — catches any unmatched route
app.use(notFoundMiddleware);

// ─── 10. Global Error Handler ────────────────────────────────────────────────
// Must be LAST — Express identifies it by the (err, req, res, next) signature
app.use(errorMiddleware);

export default app;
