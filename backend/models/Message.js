import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    attachment: {
      type: String, // URL to uploaded image or file
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Offer Negotiation specific fields
    offerAmount: {
      type: Number,
    },
    offerStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for quick retrieval of conversation history ordered by time
messageSchema.index({ conversationId: 1, createdAt: 1 });

const Message = mongoose.model('Message', messageSchema);
export default Message;
