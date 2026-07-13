import express from 'express';
import { 
  getCart, 
  syncCart, 
  getWishlist, 
  toggleWishlist, 
  createOrder, 
  getMyOrders, 
  updateOrderStatus, 
  getOrderDetails 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Cart management
router.route('/cart')
  .get(getCart)
  .post(syncCart);

// Wishlist management
router.route('/wishlist')
  .get(getWishlist)
  .post(toggleWishlist);

// Order actions
router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderDetails);

router.route('/:id/status')
  .put(updateOrderStatus);

export default router;
