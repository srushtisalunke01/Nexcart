import Business from '../models/Business.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Register a new Business Profile
// @route   POST /api/businesses/register
// @access  Private (Business Seller)
export const registerBusiness = async (req, res, next) => {
  try {
    const { companyName, businessRegistrationNumber, taxId, address, wholesaleSettings } = req.body;

    // Check if business already registered for this user
    const existingBusiness = await Business.findOne({ owner: req.user._id });
    if (existingBusiness) {
      res.status(400);
      throw new Error('A business has already been registered for this user account.');
    }

    const business = await Business.create({
      owner: req.user._id,
      companyName,
      businessRegistrationNumber,
      taxId,
      address,
      wholesaleSettings,
      verificationStatus: 'Pending', // requires admin approval
    });

    // Write audit log
    await AuditLog.create({
      user: req.user._id,
      action: 'BUSINESS_REGISTER',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: { companyName },
    });

    res.status(201).json({
      success: true,
      message: 'Business registration submitted successfully and is pending approval.',
      business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's Business Profile
// @route   GET /api/businesses/profile
// @access  Private
export const getMyBusinessProfile = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      return res.status(200).json({
        success: true,
        business: null,
        message: 'No business profile associated with this account.',
      });
    }

    res.status(200).json({
      success: true,
      business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user's Business Profile
// @route   PUT /api/businesses/profile
// @access  Private (Business Seller)
export const updateBusinessProfile = async (req, res, next) => {
  try {
    const business = await Business.findOne({ owner: req.user._id });
    if (!business) {
      res.status(404);
      throw new Error('Business profile not found');
    }

    const { companyName, logo, banner, wholesaleSettings, address } = req.body;

    if (companyName) business.companyName = companyName;
    if (logo) business.logo = logo;
    if (banner) business.banner = banner;
    if (wholesaleSettings) business.wholesaleSettings = { ...business.wholesaleSettings, ...wholesaleSettings };
    if (address) business.address = { ...business.address, ...address };

    await business.save();

    res.status(200).json({
      success: true,
      message: 'Business profile updated successfully',
      business,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active suppliers
// @route   GET /api/businesses
// @access  Public
export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Business.find({ verificationStatus: 'Approved' }).populate('owner', 'name email avatar');
    res.status(200).json({
      success: true,
      suppliers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get supplier details by Business ID or Supplier User ID
// @route   GET /api/businesses/:id
// @access  Public
export const getSupplierDetails = async (req, res, next) => {
  try {
    let business = await Business.findById(req.params.id).populate('owner', 'name email avatar');
    if (!business) {
      // fallback search by owner user ID
      business = await Business.findOne({ owner: req.params.id }).populate('owner', 'name email avatar');
    }

    if (!business) {
      res.status(404);
      throw new Error('Supplier business profile not found');
    }

    // Fetch supplier's catalog products
    const products = await Product.find({ seller: business.owner._id, isSold: false });

    res.status(200).json({
      success: true,
      business,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow/Unfollow a supplier
// @route   POST /api/businesses/:id/follow
// @access  Private
export const followSupplier = async (req, res, next) => {
  try {
    const businessId = req.params.id;
    const business = await Business.findById(businessId);
    if (!business) {
      res.status(404);
      throw new Error('Business supplier profile not found');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User account not found');
    }

    // In User document, we can store followed suppliers in a dynamically initialized array
    if (!user.followedSuppliers) {
      user.followedSuppliers = [];
    }

    const isFollowing = user.followedSuppliers.includes(businessId);
    if (isFollowing) {
      user.followedSuppliers = user.followedSuppliers.filter(id => id.toString() !== businessId.toString());
    } else {
      user.followedSuppliers.push(businessId);
    }

    // Mark model path modified since it's dynamic
    user.markModified('followedSuppliers');
    await user.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed supplier successfully' : 'Followed supplier successfully',
      isFollowing: !isFollowing,
    });
  } catch (error) {
    next(error);
  }
};
