import mongoose from 'mongoose';

const bulkPriceSchema = new mongoose.Schema({
  minQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  price: Number,
  stock: {
    type: Number,
    default: 0,
  },
  sku: String,
});

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerType: {
      type: String,
      enum: ['Business Seller', 'Individual Seller', 'Admin'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a base price'],
      min: [0, 'Price cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0, // In percentage, e.g., 10 for 10% off
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    video: {
      type: String,
    },
    variants: [variantSchema],
    specifications: [specificationSchema],
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      default: 0,
    },
    warranty: {
      type: String,
      default: 'No warranty',
    },
    deliveryInfo: {
      type: String,
      default: 'Standard delivery in 3-5 days',
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    
    // C2C specific fields
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Poor'],
      default: 'New',
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
    localPickupOnly: {
      type: Boolean,
      default: false,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    renewedAt: {
      type: Date,
      default: Date.now,
    },

    // B2B specific fields
    isWholesale: {
      type: Boolean,
      default: false,
    },
    minOrderQuantity: {
      type: Number,
      default: 1,
    },
    bulkPricing: [bulkPriceSchema],
    qas: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        answer: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Indexing for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
