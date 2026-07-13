import express from 'express';
import { 
  getConversations, 
  getChatHistory, 
  sendMessage, 
  respondToOffer 
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/history/:otherUserId', getChatHistory);
router.post('/', sendMessage);
router.put('/offer/:messageId', respondToOffer);

export default router;
