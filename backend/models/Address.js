import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      default: 'Home', // e.g. Home, Office, Warehouse
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide recipient name'],
      trim: true,
    },
    street: {
      type: String,
      required: [true, 'Please provide street details'],
    },
    city: {
      type: String,
      required: [true, 'Please provide city name'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please provide state name'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please provide country name'],
      trim: true,
    },
    zip: {
      type: String,
      required: [true, 'Please provide postal/zip code'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// If an address is set to default, set all other user addresses to isDefault: false
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
