import Coupon from '../models/Coupon.js';

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, purchaseAmount } = req.body;

    if (!code) {
      res.status(400);
      throw new Error('Please enter a coupon code');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code. Coupon does not exist.');
    }

    const isValid = coupon.isValid(req.user._id, Number(purchaseAmount));
    if (!isValid) {
      res.status(400);
      throw new Error('This coupon is either expired, inactive, usage-limited, or does not meet the minimum purchase amount.');
    }

    res.status(200).json({
      success: true,
      message: 'Coupon code validated successfully',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      couponId: coupon._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Private
export const getActiveCoupons = async (req, res, next) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now }
    }).select('code discountType discountValue minPurchaseAmount expiryDate');

    res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    next(error);
  }
};
