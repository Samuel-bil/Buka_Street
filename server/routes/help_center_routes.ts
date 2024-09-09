import express from 'express';
import { protect, authorize } from '../middleware/auth'; // Assuming you have an admin middleware
import { sendMessage, getMessages } from '../handlers/help_center_handler';

const router = express.Router();

// Route for users to send messages
router.post('/send', protect, sendMessage);

// Route for admins to get all messages
router.get('/admin/messages', protect, authorize('admin'), getMessages);

export default router;
