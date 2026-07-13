import express from 'express';
import {
  getCategories,
  getCategoryTree,
  createCategory,
} from '../controllers/categoryController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/tree', getCategoryTree);

router.post('/', protect, authorizeRoles('Admin'), createCategory);

export default router;
