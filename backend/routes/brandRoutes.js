import express from 'express';
import {
  getBrands,
  createBrand,
  createBrandRequest,
  getBrandRequests,
  updateBrandRequestStatus,
} from '../controllers/brandController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public active brands catalog
router.get('/', getBrands);

// Admin-only direct brand inserts
router.post('/', protect, authorizeRoles('Admin'), createBrand);

// Brand requests pipelines
router.get('/requests', protect, authorizeRoles('Admin'), getBrandRequests);
router.post(
  '/requests', 
  protect, 
  authorizeRoles('Individual Seller', 'Business Seller', 'Admin'), 
  createBrandRequest
);
router.put('/requests/:id', protect, authorizeRoles('Admin'), updateBrandRequestStatus);

export default router;
