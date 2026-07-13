import express from 'express';
import { validateCoupon, getActiveCoupons } from '../controllers/couponController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/validate', validateCoupon);
router.get('/', getActiveCoupons);

export default router;
