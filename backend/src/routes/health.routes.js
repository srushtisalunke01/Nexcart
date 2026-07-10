/**
 * @module routes/health.routes
 * @description Health check endpoint for uptime monitoring and load balancer probes.
 *
 * GET /api/v1/health
 *   → Returns system health including DB connection status.
 *
 * This endpoint should NOT require authentication.
 * It is used by:
 *   - Docker HEALTHCHECK
 *   - Load balancers (ALB, Nginx)
 *   - Uptime monitoring services (UptimeRobot, etc.)
 */

import { Router } from "express";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import API_MESSAGES from "../constants/apiMessages.js";
import HTTP_STATUS from "../constants/httpStatus.js";
import APP_CONSTANTS from "../constants/appConstants.js";

const router = Router();

/**
 * GET /api/v1/health
 * Returns the API health status including database connection state.
 */
router.get("/", (_req, res) => {
  // Mongoose readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  const healthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
    application: APP_CONSTANTS.APP.NAME,
    version: APP_CONSTANTS.APP.VERSION,
    environment: process.env.NODE_ENV || "development",
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: isDbConnected ? "connected" : "disconnected",
      readyState: dbState,
    },
    memory: {
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
    },
  };

  const statusCode = isDbConnected ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;
  const message = isDbConnected
    ? API_MESSAGES.HEALTH.OK
    : API_MESSAGES.HEALTH.DB_DISCONNECTED;

  return new ApiResponse(statusCode, message, healthData).send(res);
});

export default router;
