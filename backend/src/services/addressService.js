/**
 * @module services/addressService
 * @description Address business logic.
 *
 * Handles creation, reading, updating, deleting, and setting default address.
 */

import addressRepository from "../repositories/addressRepository.js";
import { ApiError } from "../utils/ApiError.js";
import API_MESSAGES from "../constants/apiMessages.js";
import APP_CONSTANTS from "../constants/appConstants.js";

class AddressService {
  /**
   * Get all addresses for a user.
   *
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getAllAddresses(userId) {
    return await addressRepository.findByUserId(userId);
  }

  /**
   * Add a new address for a user.
   *
   * @param {string} userId
   * @param {Object} addressData
   * @returns {Promise<Object>}
   */
  async addAddress(userId, addressData) {
    // 1. Enforce max addresses limit
    const currentAddresses = await addressRepository.findByUserId(userId);
    // Assuming a limit of 10 addresses for now, you can add this to appConstants if needed
    if (currentAddresses.length >= 10) {
      throw ApiError.badRequest("You have reached the maximum number of saved addresses.");
    }

    // 2. If it's the first address, make it default automatically
    if (currentAddresses.length === 0) {
      addressData.isDefault = true;
    }

    // 3. Create the address
    const newAddress = await addressRepository.create({
      ...addressData,
      user: userId,
    });

    return newAddress;
  }

  /**
   * Update an existing address.
   *
   * @param {string} userId
   * @param {string} addressId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateAddress(userId, addressId, updateData) {
    // 1. Verify ownership (prevent updating someone else's address)
    const address = await addressRepository.findById(addressId);
    if (!address) {
      throw ApiError.notFound("Address");
    }

    if (address.user.toString() !== userId.toString()) {
      throw ApiError.forbidden(API_MESSAGES.GENERIC.FORBIDDEN);
    }

    // 2. Update address
    const updatedAddress = await addressRepository.updateById(addressId, updateData);
    return updatedAddress;
  }

  /**
   * Remove an address.
   *
   * @param {string} userId
   * @param {string} addressId
   * @returns {Promise<boolean>}
   */
  async removeAddress(userId, addressId) {
    // 1. Verify ownership
    const address = await addressRepository.findById(addressId);
    if (!address) {
      throw ApiError.notFound("Address");
    }

    if (address.user.toString() !== userId.toString()) {
      throw ApiError.forbidden(API_MESSAGES.GENERIC.FORBIDDEN);
    }

    // 2. If deleting the default address, we should ideally assign default to another address,
    // but for simplicity, we'll just let them delete it and the next created will be default
    // or user can manually set another as default.
    await addressRepository.deleteById(addressId);

    return true;
  }

  /**
   * Set an address as the default.
   *
   * @param {string} userId
   * @param {string} addressId
   * @returns {Promise<Object>}
   */
  async setDefaultAddress(userId, addressId) {
    const updatedAddress = await addressRepository.setDefault(addressId, userId);
    
    if (!updatedAddress) {
      throw ApiError.notFound("Address");
    }

    return updatedAddress;
  }
}

export default new AddressService();
