/**
 * @module repositories/addressRepository
 * @description Database operations for the Address model.
 */

import Address from "../models/address.model.js";

class AddressRepository {
  /**
   * Create a new address.
   *
   * @param {Object} addressData
   * @returns {Promise<Object>} Created address document
   */
  async create(addressData) {
    const address = new Address(addressData);
    return await address.save();
  }

  /**
   * Find all addresses for a specific user.
   * Sorted to show default address first, then newest.
   *
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async findByUserId(userId) {
    return await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
  }

  /**
   * Find a specific address by its ID.
   *
   * @param {string} addressId
   * @returns {Promise<Object|null>}
   */
  async findById(addressId) {
    return await Address.findById(addressId);
  }

  /**
   * Update an address by ID.
   *
   * @param {string} addressId
   * @param {Object} updateData
   * @returns {Promise<Object|null>}
   */
  async updateById(addressId, updateData) {
    // If setting to default, use save() instead of findByIdAndUpdate to trigger the pre-save hook
    if (updateData.isDefault === true) {
      const address = await Address.findById(addressId);
      if (!address) return null;
      
      Object.assign(address, updateData);
      return await address.save();
    }

    return await Address.findByIdAndUpdate(addressId, updateData, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete an address by ID.
   *
   * @param {string} addressId
   * @returns {Promise<Object|null>}
   */
  async deleteById(addressId) {
    return await Address.findByIdAndDelete(addressId);
  }

  /**
   * Set a specific address as default for a user.
   *
   * @param {string} addressId
   * @param {string} userId
   * @returns {Promise<Object|null>}
   */
  async setDefault(addressId, userId) {
    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) return null;

    address.isDefault = true;
    return await address.save(); // Triggers the pre-save hook to unset others
  }
}

export default new AddressRepository();
