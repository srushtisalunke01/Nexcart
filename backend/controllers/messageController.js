import Message from '../models/Message.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// Helper to generate conversationId from two user IDs
const getConversationId = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort().join('_');
};

// @desc    Get user conversations (chat threads list)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // Aggregate to find the latest message from each unique conversationId
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    const formattedConversations = [];

    for (const convo of conversations) {
      // Extract the other participant ID
      const participants = convo._id.split('_');
      const otherUserId = participants.find(p => p !== currentUserId.toString());
      
      if (!otherUserId) continue;

      const otherUser = await User.findById(otherUserId).select('name email avatar role');
      if (!otherUser) continue;

      formattedConversations.push({
        conversationId: convo._id,
        otherUser,
        lastMessage: convo.lastMessage,
      });
    }

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages between two users (chat history)
// @route   GET /api/messages/history/:otherUserId
// @access  Private
export const getChatHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.otherUserId;
    const conversationId = getConversationId(req.user._id, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate('product', 'name price images condition')
      .sort({ createdAt: 1 });

    // Mark incoming messages as read
    await Message.updateMany(
      { conversationId, receiver: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message (Text, file upload, or negotiation offer)
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text, attachment, offerAmount, productId } = req.body;

    if (!receiverId) {
      res.status(400);
      throw new Error('Please specify a message receiver');
    }

    const conversationId = getConversationId(req.user._id, receiverId);

    // If an offer is sent, ensure a product ID exists
    let offerStatus = undefined;
    if (offerAmount) {
      offerStatus = 'Pending';
    }

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      text,
      attachment,
      offerAmount,
      offerStatus,
      product: productId,
    });

    // Populate product reference before returning
    if (productId) {
      await message.populate('product', 'name price images condition');
    }

    // Trigger Notification for the receiver
    await Notification.create({
      user: receiverId,
      type: 'Message',
      title: `✉️ New Message from ${req.user.name}`,
      message: offerAmount 
        ? `Sent an offer of $${offerAmount} on product.` 
        : text.length > 50 ? `${text.slice(0, 50)}...` : text,
      link: '/profile',
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to negotiation offer (Accept / Decline)
// @route   PUT /api/messages/offer/:messageId
// @access  Private
export const respondToOffer = async (req, res, next) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Declined'
    const messageId = req.params.messageId;

    if (!['Accepted', 'Declined'].includes(status)) {
      res.status(400);
      throw new Error('Invalid offer status response');
    }

    const message = await Message.findById(messageId);
    if (!message) {
      res.status(404);
      throw new Error('Offer message not found');
    }

    // Only the receiver of the offer can accept or decline it
    if (message.receiver.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to respond to this offer');
    }

    message.offerStatus = status;
    await message.save();

    // Trigger Notification to sender
    await Notification.create({
      user: message.sender,
      type: 'Message',
      title: `🤝 Negotiation Offer ${status}`,
      message: `Your offer of $${message.offerAmount} was ${status.toLowerCase()} by the seller.`,
      link: '/profile',
    });

    // If accepted and it's a C2C deal, we can optionally perform actions (e.g. buyer checkout helper or info)
    res.status(200).json({
      success: true,
      message: `Offer has been ${status.toLowerCase()} successfully.`,
      updatedMessage: message,
    });
  } catch (error) {
    next(error);
  }
};
