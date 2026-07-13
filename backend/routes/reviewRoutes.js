import express from 'express';
import { 
  createReview, 
  getProductReviews, 
  getSellerReviews, 
  askQuestion, 
  answerQuestion 
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Private routes
router.post('/', protect, createReview);
router.get('/seller/:sellerId', protect, getSellerReviews);
router.post('/qas/:productId', protect, askQuestion);
router.put('/qas/:productId/:qaId', protect, answerQuestion);

export default router;
