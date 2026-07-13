import mongoose from 'mongoose';

const inventoryLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['StockIn', 'StockOut', 'Correction'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true,
    },
    stockLevel: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot fall below zero'],
    },
    reorderPoint: {
      type: Number,
      default: 5, // Alert user to reorder if stock level drops below this
    },
    warehouseLocation: {
      type: String,
      trim: true,
      default: 'General Warehouse',
    },
    logs: [inventoryLogSchema],
  },
  {
    timestamps: true,
  }
);

// Method to update stock levels and log transactions
inventorySchema.methods.updateStock = async function (type, qty, reason) {
  if (type === 'StockOut' && this.stockLevel < qty) {
    throw new Error('Insufficient stock for order dispatch');
  }

  const delta = type === 'StockOut' ? -qty : qty;
  this.stockLevel += delta;
  
  this.logs.push({
    type,
    quantity: qty,
    reason,
  });

  return await this.save();
};

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
