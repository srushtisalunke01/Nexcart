/**
 * @module server
 * @description Application entry point.
 *
 * Responsibilities (in order):
 *   1. Load and validate environment variables (fail-fast)
 *   2. Connect to MongoDB Atlas
 *   3. Import and start the Express application
 *   4. Handle graceful shutdown on SIGTERM/SIGINT
 *   5. Handle uncaught exceptions and unhandled promise rejections
 *
 * This file intentionally contains minimal logic.
 * All Express configuration lives in app.js.
 * All database configuration lives in src/config/database.js.
 */

// ─── Step 1: Load Environment Variables ──────────────────────────────────────
// env.js MUST be imported first — it calls dotenv.config() and validates all
// required variables. If any are missing, the process exits with a clear error.
import env from "./src/config/env.js";

import logger from "./src/config/logger.js";
import { connectDatabase, disconnectDatabase } from "./src/config/database.js";
import app from "./app.js";

// ─── Process-Level Error Handlers ────────────────────────────────────────────
// These catch programmer errors that escaped all other error handlers.
// They log the error and gracefully shut down to prevent undefined state.

/**
 * Handles uncaught synchronous exceptions (bugs, programming errors).
 * Example: accessing property of undefined, ReferenceError, etc.
 */
process.on("uncaughtException", (error) => {
  logger.error("[FATAL] Uncaught Exception. Shutting down...", {
    error: error.message,
    stack: error.stack,
  });
  // Allow logger to flush before exit
  process.exit(1);
});

/**
 * Handles unhandled promise rejections.
 * Example: async function throwing without a catch, or rejected promise without .catch()
 *
 * In Node 18+, unhandled rejections cause process exit by default.
 * We handle it explicitly for clean logging.
 */
process.on("unhandledRejection", (reason, promise) => {
  logger.error("[FATAL] Unhandled Promise Rejection. Shutting down...", {
    reason: reason?.message || reason,
    promise: promise.toString(),
  });
  // Graceful exit: close server first if it's running
  shutdownGracefully("unhandledRejection");
});

// ─── HTTP Server Reference ────────────────────────────────────────────────────
// Stored here so graceful shutdown can call server.close()
let httpServer;

/**
 * Gracefully shuts down the application:
 *   1. Stop accepting new HTTP connections
 *   2. Close the MongoDB connection
 *   3. Exit the process
 *
 * @param {string} signal - The shutdown trigger (SIGTERM, SIGINT, etc.)
 */
const shutdownGracefully = async (signal) => {
  logger.info(`[Server] Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting new connections
  if (httpServer) {
    httpServer.close(() => {
      logger.info("[Server] HTTP server closed.");
    });
  }

  // Close MongoDB connection
  await disconnectDatabase();

  logger.info("[Server] Graceful shutdown complete. Goodbye.");
  process.exit(0);
};

// Register OS signal handlers for clean container/PM2 shutdown
process.on("SIGTERM", () => shutdownGracefully("SIGTERM")); // Kubernetes, Docker stop
process.on("SIGINT", () => shutdownGracefully("SIGINT"));   // Ctrl+C in terminal

// ─── Application Bootstrap ────────────────────────────────────────────────────
/**
 * Main bootstrap function.
 * Async IIFE to allow top-level await semantics cleanly.
 */
const bootstrap = async () => {
  try {
    logger.info(`[Server] Starting NexCart API in ${env.NODE_ENV} mode...`);

    // ── Step 2: Connect to Database ────────────────────────────────────────
    await connectDatabase();

    // ── Step 3: Start HTTP Server ──────────────────────────────────────────
    httpServer = app.listen(env.PORT, () => {
      logger.info(`[Server] ✓ NexCart API is running`);
      logger.info(`[Server]   → Environment : ${env.NODE_ENV}`);
      logger.info(`[Server]   → Port        : ${env.PORT}`);
      logger.info(`[Server]   → API Base    : http://localhost:${env.PORT}/api/${env.API_VERSION}`);
      logger.info(`[Server]   → Health      : http://localhost:${env.PORT}/api/${env.API_VERSION}/health`);
    });

    // Handle server errors (e.g., port already in use)
    httpServer.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        logger.error(`[Server] Port ${env.PORT} is already in use. Exiting.`);
      } else {
        logger.error("[Server] HTTP server error.", { error: error.message });
      }
      process.exit(1);
    });
  } catch (error) {
    // Startup failures (e.g., DB connection failed after all retries)
    logger.error("[Server] Failed to start application.", {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// ─── Start ───────────────────────────────────────────────────────────────────
bootstrap();