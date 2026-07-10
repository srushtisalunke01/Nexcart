/**
 * @module config/database
 * @description MongoDB Atlas connection management.
 *
 * Responsibilities:
 *   - Establish connection with optimal pooling settings
 *   - Retry connection on initial failure with exponential backoff
 *   - Log connection lifecycle events
 *   - Provide graceful shutdown via disconnectDatabase()
 *
 * Usage:
 *   import { connectDatabase, disconnectDatabase } from './config/database.js';
 *   await connectDatabase();
 */

import mongoose from "mongoose";
import env from "./env.js";
import logger from "./logger.js";

// ─── Connection Options ───────────────────────────────────────────────────────
const MONGOOSE_OPTIONS = {
  // Connection pool: maximum number of connections in the pool
  maxPoolSize: 10,
  // Minimum pool connections to keep alive
  minPoolSize: 2,
  // How long to wait for a connection from the pool before timing out (ms)
  serverSelectionTimeoutMS: 5000,
  // How long a send or receive on a socket can take before timing out (ms)
  socketTimeoutMS: 45000,
  // Heartbeat frequency (ms)
  heartbeatFrequencyMS: 10000,
};

// ─── Retry Configuration ──────────────────────────────────────────────────────
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000; // 1 second

/**
 * Attempts to connect to MongoDB with exponential backoff retry logic.
 *
 * @param {number} attempt - Current attempt number (1-indexed)
 * @returns {Promise<void>}
 * @throws {Error} After MAX_RETRIES failed attempts
 */
const attemptConnection = async (attempt = 1) => {
  try {
    logger.info(`[DB] Connection attempt ${attempt}/${MAX_RETRIES}...`);
    await mongoose.connect(env.MONGODB_URI, MONGOOSE_OPTIONS);
  } catch (error) {
    if (attempt >= MAX_RETRIES) {
      logger.error(`[DB] All ${MAX_RETRIES} connection attempts failed. Giving up.`, {
        error: error.message,
      });
      throw error;
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
    logger.warn(`[DB] Connection failed. Retrying in ${delay}ms...`, {
      error: error.message,
      attempt,
    });

    await new Promise((resolve) => setTimeout(resolve, delay));
    return attemptConnection(attempt + 1);
  }
};

/**
 * Registers Mongoose connection event listeners for observability.
 */
const registerConnectionEvents = () => {
  const conn = mongoose.connection;

  conn.on("connected", () => {
    logger.info(`[DB] MongoDB connected → ${conn.host}:${conn.port}/${conn.name}`);
  });

  conn.on("disconnected", () => {
    logger.warn("[DB] MongoDB disconnected.");
  });

  conn.on("reconnected", () => {
    logger.info("[DB] MongoDB reconnected.");
  });

  conn.on("error", (error) => {
    logger.error("[DB] MongoDB connection error.", { error: error.message });
  });
};

/**
 * Public entry point: connects to MongoDB Atlas.
 * Call this once in server.js before starting the HTTP server.
 *
 * @returns {Promise<void>}
 */
export const connectDatabase = async () => {
  registerConnectionEvents();
  await attemptConnection();
};

/**
 * Gracefully closes the MongoDB connection.
 * Called during server shutdown to prevent connection leaks.
 *
 * @returns {Promise<void>}
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info("[DB] MongoDB connection closed gracefully.");
  } catch (error) {
    logger.error("[DB] Error closing MongoDB connection.", { error: error.message });
  }
};
