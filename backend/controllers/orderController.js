import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Inventory from '../models/Inventory.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';

// @desc    Get user's Cart
// @route   GET /api/orders/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price discount images stock isWholesale minOrderQuantity bulkPricing condition seller sellerType');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync user's Cart
// @route   POST /api/orders/cart
// @access  Private
export const syncCart = async (req, res, next) => {
  try {
    const { items } = req.body; // array of { product, quantity, color, size }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    cart.items = items;
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully',
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's Wishlist
// @route   GET /api/orders/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name price discount images rating sellerType condition');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to Wishlist
// @route   POST /api/orders/wishlist
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    const isAdded = wishlist.products.includes(productId);
    if (isAdded) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId.toString());
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: isAdded ? 'Removed from wishlist' : 'Added to wishlist',
      isAdded: !isAdded,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new checkout order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No items listed for order creation');
    }

    let itemsPrice = 0;
    const finalItems = [];

    // Verify stock and calculate dynamic pricing (incorporating B2B tiered bulk prices)
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product reference ${item.product} not found`);
      }

      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      // Check MOQ for B2B wholesale
      if (product.isWholesale && item.quantity < product.minOrderQuantity) {
        res.status(400);
        throw new Error(`Minimum order quantity for ${product.name} is ${product.minOrderQuantity} units.`);
      }

      // Calculate unit price: check if B2B tiered wholesale pricing is active
      let unitPrice = product.price;
      
      if (product.isWholesale && product.bulkPricing && product.bulkPricing.length > 0) {
        // Sort tiers by minQuantity descending to find highest matched tier
        const matchedTier = [...product.bulkPricing]
          .sort((a, b) => b.minQuantity - a.minQuantity)
          .find(tier => item.quantity >= tier.minQuantity);
        
        if (matchedTier) {
          unitPrice = matchedTier.price;
        }
      }

      // apply discount if standard retail
      if (!product.isWholesale && product.discount > 0) {
        unitPrice = Math.round(unitPrice * (1 - product.discount / 100));
      }

      const totalItemCost = unitPrice * item.quantity;
      itemsPrice += totalItemCost;

      finalItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: unitPrice,
        color: item.color,
        size: item.size,
        seller: product.seller,
      });

      // Deduct product stock & adjust inventory levels
      product.stock -= item.quantity;
      if (product.stock === 0 && !product.isWholesale) {
        product.isSold = true; // Mark C2C products sold when out of stock
      }
      await product.save();

      const inventory = await Inventory.findOne({ product: product._id });
      if (inventory) {
        await inventory.updateStock('StockOut', item.quantity, `Sales dispatch order.`);
        
        // Stock Alert check
        if (inventory.stockLevel <= inventory.reorderPoint) {
          await Notification.create({
            user: product.seller,
            type: 'Stock',
            title: '⚠️ Stock Alert',
            message: `Product stock level for "${product.name}" is low (${inventory.stockLevel} units remaining).`,
            link: '/profile',
          });
        }
      }
    }

    // Process coupon if supplied
    let discountAmount = 0;
    let couponRef = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isValid(req.user._id, itemsPrice)) {
        if (coupon.discountType === 'Percentage') {
          discountAmount = Math.round(itemsPrice * (coupon.discountValue / 100));
        } else {
          discountAmount = Math.min(coupon.discountValue, itemsPrice);
        }
        couponRef = coupon._id;
        coupon.usedBy.push(req.user._id);
        await coupon.save();
      }
    }

    const shippingPrice = itemsPrice > 500 ? 0 : 50; // free shipping on orders over $500
    const taxPrice = Math.round((itemsPrice - discountAmount) * 0.08); // 8% sales tax
    const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

    // Create Order document
    const order = await Order.create({
      buyer: req.user._id,
      items: finalItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      shippingPrice,
      taxPrice,
      itemsPrice,
      discountAmount,
      totalPrice,
      coupon: couponRef,
      orderStatus: 'Processing',
    });

    // Clear cart after checkout
    await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

    // Send Notification to Buyer
    await Notification.create({
      user: req.user._id,
      type: 'Order',
      title: '📦 Order Confirmation',
      message: `Your order for $${totalPrice} has been processed successfully. Tracking ID: ${order._id}`,
      link: '/profile',
    });

    // Send Notification to Sellers
    const uniqueSellers = [...new Set(finalItems.map(i => i.seller.toString()))];
    for (const sellerId of uniqueSellers) {
      await Notification.create({
        user: sellerId,
        type: 'Order',
        title: '💰 New Sale Received',
        message: `You have received a new purchase order. View dashboard to process dispatch details.`,
        link: '/profile',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order checked out successfully.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders (Buyer & Seller perspectives)
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    // Buyer orders
    const buyerOrders = await Order.find({ buyer: req.user._id })
      .populate('items.product', 'images name condition')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 });

    // Seller orders (orders where the user is listed as the seller of items)
    const sellerOrders = await Order.find({ 'items.seller': req.user._id })
      .populate('buyer', 'name email avatar')
      .populate('items.product', 'images name')
      .sort({ createdAt: -1 });

    // Filter items specific to this seller for dashboard clean displays
    const sellerFilteredOrders = sellerOrders.map(order => {
      const orderCopy = order.toObject();
      orderCopy.items = orderCopy.items.filter(item => item.seller.toString() === req.user._id.toString());
      return orderCopy;
    });

    res.status(200).json({
      success: true,
      buyerOrders,
      sellerOrders: sellerFilteredOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery status
// @route   PUT /api/orders/:id/status
// @access  Private (Sellers, Admins)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order details not found');
    }

    // Verify authorized user: must be a seller in the order or an Admin
    const isSeller = order.items.some(item => item.seller.toString() === req.user._id.toString());
    if (!isSeller && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Forbidden: Unauthorized to adjust order status');
    }

    order.orderStatus = status;
    order.timeline.push({
      status,
      note: note || `Order transitioned to status: ${status}`,
    });

    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    await order.save();

    // Trigger Notification for buyer
    await Notification.create({
      user: order.buyer,
      type: 'Order',
      title: '🚚 Order Updates',
      message: `Your order status has been updated to "${status}". Note: ${note || ''}`,
      link: '/profile',
    });

    res.status(200).json({
      success: true,
      message: 'Order delivery status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phoneNumber')
      .populate('items.product', 'images name condition isWholesale')
      .populate('items.seller', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Must be buyer, seller, or admin to access details
    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.items.some(item => item.seller._id.toString() === req.user._id.toString());

    if (!isBuyer && !isSeller && req.user.role !== 'Admin') {
      res.status(403);
      throw new Error('Not authorized to view this order asset');
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};
