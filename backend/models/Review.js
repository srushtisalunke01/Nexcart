import mongoose from 'mongoose';
import Product from './Product.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please select a rating (1 to 5)'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add a comment'],
      trim: true,
    },
    images: [String],
    sellerRating: {
      type: Number, // Rating given to the seller/business specifically
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from leaving multiple reviews for the same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to get avg rating and update product
reviewSchema.statics.getAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(obj[0].averageRating * 10) / 10,
        reviewsCount: obj[0].reviewsCount,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        rating: 0,
        reviewsCount: 0,
      });
    }
  } catch (err) {
    console.error(`Error updating product rating stats: ${err}`);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

// Call getAverageRating after delete/remove
reviewSchema.post('remove', async function () {
  await this.constructor.getAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
