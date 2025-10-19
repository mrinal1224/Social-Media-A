import express from 'express';
import {
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessagesAsRead,
  deleteMessage
} from '../controllers/message.controllers.js';
import isAuth from '../middlewares/isAuth.js';

const messageRouter = express.Router();

// Send a new message
messageRouter.post('/send', isAuth, sendMessage);

// Get conversation messages with a specific user
messageRouter.get('/conversation/:userId', isAuth, getConversationMessages);

// Get all conversations for current user
messageRouter.get('/conversations', isAuth, getUserConversations);

// Mark messages as read in a conversation
messageRouter.put('/markAsRead/:conversationId', isAuth, markMessagesAsRead);

// Delete a specific message
messageRouter.delete('/:messageId', isAuth, deleteMessage);

export default messageRouter;
