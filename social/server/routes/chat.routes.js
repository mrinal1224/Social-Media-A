import express from 'express';
import { accessChat, getChats, sendMessage, getMessages } from '../controllers/chat.controller.js';
import { protect } from '../middlewares/authMiddleware.js'; // Assuming you have an authentication middleware

const router = express.Router();

// Route to access a chat (start a new one or get existing)
router.route('/').post(protect, accessChat); 
// Route to fetch all chats for the logged in user
router.route('/').get(protect, getChats); 

// Route to send a new message
router.route('/message').post(protect, sendMessage);
// Route to get all messages for a specific chat
router.route('/message/:chatId').get(protect, getMessages);

export default router;