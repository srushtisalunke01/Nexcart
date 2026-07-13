import express from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController.js';
import { 
  validateRegister, 
  validateLogin, 
  validateForgotPassword, 
  validateResetPassword 
} from '../middleware/authValidator.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:resetToken', validateResetPassword, resetPassword);

export default router;
