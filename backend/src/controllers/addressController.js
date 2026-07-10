/**
 * @module controllers/addressController
 * @description Address HTTP endpoints.
 *
 * Handles CRUD operations for user addresses.
 */

import addressService from "../services/addressService.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import API_MESSAGES from "../constants/apiMessages.js";
import HTTP_STATUS from "../constants/httpStatus.js";

/**
 * Get all addresses for the current user.
 * GET /api/v1/addresses
 */
export const getAllAddresses = async (req, res) => {
  const addresses = await addressService.getAllAddresses(req.user.userId);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.ADDRESSES_FETCHED, addresses).send(res);
};

/**
 * Add a new address.
 * POST /api/v1/addresses
 */
export const addAddress = async (req, res) => {
  const address = await addressService.addAddress(req.user.userId, req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, API_MESSAGES.USER.ADDRESS_ADDED, address).send(res);
};

/**
 * Update an existing address.
 * PUT /api/v1/addresses/:id
 */
export const updateAddress = async (req, res) => {
  const address = await addressService.updateAddress(req.user.userId, req.params.id, req.body);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.ADDRESS_UPDATED, address).send(res);
};

/**
 * Remove an address.
 * DELETE /api/v1/addresses/:id
 */
export const removeAddress = async (req, res) => {
  await addressService.removeAddress(req.user.userId, req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.ADDRESS_DELETED).send(res);
};

/**
 * Set an address as the default address.
 * PATCH /api/v1/addresses/:id/default
 */
export const setDefaultAddress = async (req, res) => {
  const address = await addressService.setDefaultAddress(req.user.userId, req.params.id);
  return new ApiResponse(HTTP_STATUS.OK, API_MESSAGES.USER.ADDRESS_UPDATED, address).send(res);
};
