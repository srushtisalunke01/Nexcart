import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  getNotifications,
  markNotificationsRead,
  getWalletStats,
  topUpWallet
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProfile)
  .put(updateProfile);

router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:id')
  .put(updateAddress)
  .delete(deleteAddress);

router.route('/notifications')
  .get(getNotifications);

router.route('/notifications/read')
  .put(markNotificationsRead);

router.route('/wallet')
  .get(getWalletStats);

router.route('/wallet/topup')
  .post(topUpWallet);

export default router;
