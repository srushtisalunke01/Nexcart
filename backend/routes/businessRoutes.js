import express from 'express';
import { 
  registerBusiness, 
  getMyBusinessProfile, 
  updateBusinessProfile, 
  getSuppliers, 
  getSupplierDetails,
  followSupplier
} from '../controllers/businessController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSuppliers);
router.get('/:id', getSupplierDetails);

// Private routes
router.post('/register', protect, registerBusiness);
router.get('/profile/me', protect, getMyBusinessProfile);
router.put('/profile', protect, authorizeRoles('Business Seller'), updateBusinessProfile);
router.post('/:id/follow', protect, followSupplier);

export default router;
