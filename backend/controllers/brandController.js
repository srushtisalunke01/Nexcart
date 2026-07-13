import Brand from '../models/Brand.js';
import BrandRequest from '../models/BrandRequest.js';

// Helper to construct slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all active brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private (Admin Only)
export const createBrand = async (req, res, next) => {
  try {
    const { name, logo, description } = req.body;

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      res.status(400);
      throw new Error('A brand with this name already exists');
    }

    const brand = await Brand.create({
      name,
      slug: slugify(name),
      logo,
      description,
    });

    return res.status(201).json({
      success: true,
      brand,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a brand request
// @route   POST /api/brands/requests
// @access  Private (Seller/Business Seller/Admin)
export const createBrandRequest = async (req, res, next) => {
  try {
    const { brandName, logo, description, website } = req.body;

    const request = await BrandRequest.create({
      seller: req.user._id,
      brandName,
      logo,
      description,
      website,
    });

    return res.status(201).json({
      success: true,
      message: 'Brand inclusion request submitted for review',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all brand requests
// @route   GET /api/brands/requests
// @access  Private (Admin Only)
export const getBrandRequests = async (req, res, next) => {
  try {
    const requests = await BrandRequest.find().populate('seller', 'name email role');
    return res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject brand request
// @route   PUT /api/brands/requests/:id
// @access  Private (Admin Only)
export const updateBrandRequestStatus = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status update parameter');
    }

    const request = await BrandRequest.findById(req.params.id);
    if (!request) {
      res.status(404);
      throw new Error('Brand request record not found');
    }

    request.status = status;
    if (status === 'Rejected') {
      request.rejectionReason = rejectionReason || 'Does not match platform standards';
    }
    await request.save();

    // If approved, dynamically create the Brand document
    if (status === 'Approved') {
      const brandExists = await Brand.findOne({ name: request.brandName });
      if (!brandExists) {
        await Brand.create({
          name: request.brandName,
          slug: slugify(request.brandName),
          logo: request.logo || undefined,
          description: request.description || 'Verified via seller request approvals.',
          isActive: true
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Brand request successfully ${status.toLowerCase()}`,
      request,
    });
  } catch (error) {
    next(error);
  }
};
