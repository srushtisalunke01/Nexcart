import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true,
      unique: true,
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1643321612240-6644f0b2f561?auto=format&fit=crop&q=80&w=1200',
    },
    businessRegistrationNumber: {
      type: String,
      required: [true, 'Please provide business registration number/licence'],
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    taxId: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String,
    },
    wholesaleSettings: {
      minOrderAmount: {
        type: Number,
        default: 0,
      },
      allowNegotiations: {
        type: Boolean,
        default: true,
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Business = mongoose.model('Business', businessSchema);
export default Business;
