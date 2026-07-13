import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchSuggestions,
} from '../controllers/productController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public listings search and recommendations
router.get('/', getProducts);
router.get('/search/suggestions', searchSuggestions);
router.get('/:id', getProductById);

// Seller/Admin managed listings actions
router.post(
  '/', 
  protect, 
  authorizeRoles('Individual Seller', 'Business Seller', 'Admin'), 
  createProduct
);
router.put(
  '/:id', 
  protect, 
  authorizeRoles('Individual Seller', 'Business Seller', 'Admin'), 
  updateProduct
);
router.delete(
  '/:id', 
  protect, 
  authorizeRoles('Individual Seller', 'Business Seller', 'Admin'), 
  deleteProduct
);

export default router;
