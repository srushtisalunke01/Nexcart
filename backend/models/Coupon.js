import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please provide a coupon code'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ['Percentage', 'FixedAmount'],
      default: 'Percentage',
      required: true,
    },
    discountValue: {
      type: Number,
      required: [true, 'Please provide a discount value'],
      min: [0, 'Discount value cannot be negative'],
    },
    minPurchaseAmount: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide an expiry date'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to check validation status
couponSchema.methods.isValid = function (userId, purchaseAmount) {
  const now = new Date();
  if (!this.isActive) return false;
  if (now > this.expiryDate) return false;
  if (purchaseAmount < this.minPurchaseAmount) return false;
  if (this.usageLimit && this.usedBy.length >= this.usageLimit) return false;
  if (userId && this.usedBy.includes(userId)) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
