import User from '../models/User.js';
import Address from '../models/Address.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Get user profile details
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User profile not found');
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User profile not found');
    }

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile details updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        phoneNumber: user.phoneNumber
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved addresses
// @route   GET /api/profile/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a saved address
// @route   POST /api/profile/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { title, name, street, city, state, country, zip, phone, isDefault } = req.body;

    const address = await Address.create({
      user: req.user._id,
      title,
      name,
      street,
      city,
      state,
      country,
      zip,
      phone,
      isDefault: isDefault || false,
    });

    res.status(201).json({
      success: true,
      message: 'Address saved successfully',
      address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a saved address
// @route   PUT /api/profile/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      res.status(404);
      throw new Error('Address record not found');
    }

    const { title, name, street, city, state, country, zip, phone, isDefault } = req.body;
    if (title !== undefined) address.title = title;
    if (name !== undefined) address.name = name;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (country !== undefined) address.country = country;
    if (zip !== undefined) address.zip = zip;
    if (phone !== undefined) address.phone = phone;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a saved address
// @route   DELETE /api/profile/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      res.status(404);
      throw new Error('Address record not found');
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/profile/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/profile/notifications/read
// @access  Private
export const markNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    res.status(200).json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Wallet Profile UI stats
// @route   GET /api/profile/wallet
// @access  Private
export const getWalletStats = async (req, res, next) => {
  try {
    // In a full application, a wallet schema handles transactions.
    // For a clean implementation, we can simulate wallet data linked to user settings or hardcoded state.
    res.status(200).json({
      success: true,
      balance: req.user.walletBalance || 5000, // default dummy starting cash
      transactions: [
        { id: 't1', type: 'Credit', amount: 5000, reason: 'Initial Wallet Welcome Gift', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      ],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add funds to Wallet (simulated)
// @route   POST /api/profile/wallet/topup
// @access  Private
export const topUpWallet = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      res.status(400);
      throw new Error('Please select a valid topup amount');
    }

    res.status(200).json({
      success: true,
      message: `Simulated $${amount} successfully loaded into your wallet balance.`,
    });
  } catch (error) {
    next(error);
  }
};
