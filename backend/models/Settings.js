import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'NEXUS ONE',
    },
    siteLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    commissionPercentage: {
      type: Number,
      default: 10.0, // Default 10% commission on orders
      min: 0,
      max: 100,
    },
    allowedPayoutMethods: {
      type: [String],
      default: ['Bank Transfer', 'Stripe', 'PayPal'],
    },
    termsOfServiceUrl: {
      type: String,
      default: '/terms-of-service',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure there is only ever one Settings document
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
