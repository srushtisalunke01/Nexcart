import express from 'express';
import { 
  getUsers, 
  updateUser, 
  deleteUser, 
  getPendingBusinesses, 
  verifyBusiness,
  getReports,
  createReport,
  resolveReport,
  createCoupon,
  deleteCoupon,
  getGlobalAnalytics
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Report creation endpoint is accessible by any authenticated user
router.post('/reports', protect, createReport);

// All other endpoints restrict access strictly to Admin role
router.use(protect, authorizeRoles('Admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/businesses/pending')
  .get(getPendingBusinesses);

router.route('/businesses/:id/verify')
  .put(verifyBusiness);

router.route('/reports')
  .get(getReports);

router.route('/reports/:id')
  .put(resolveReport);

router.route('/coupons')
  .post(createCoupon);

router.route('/coupons/:id')
  .delete(deleteCoupon);

router.route('/analytics')
  .get(getGlobalAnalytics);

export default router;
