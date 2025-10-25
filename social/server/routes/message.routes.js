import express from "express";
import {
  sendMessage,
  getConversations,
  getMessages,
  getChatUsers,
  deleteConversation,
} from "../controllers/message.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const messageRouter = express.Router();

// Send a message
messageRouter.post("/send", isAuth, sendMessage);

// Get all conversations for current user
messageRouter.get("/conversations", isAuth, getConversations);

// Get messages with a specific user
messageRouter.get("/:userId", isAuth, getMessages);

// Get users to chat with (following list)
messageRouter.get("/users/chat", isAuth, getChatUsers);

// Delete a conversation
messageRouter.delete("/conversation/:conversationId", isAuth, deleteConversation);

export default messageRouter;
