import { Conversation, Message } from "../models/message.model.js";
import User from "../models/user.model.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.userId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create the message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      receiver: receiverId,
      text: text.trim(),
    });

    // Update conversation's last message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Populate message with sender details
    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "userName profileImage")
      .populate("receiver", "userName profileImage");

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: `Cannot send message: ${error}` });
  }
};

// Get all conversations for the current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "userName profileImage")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "userName profileImage",
        },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    return res
      .status(500)
      .json({ message: `Cannot get conversations: ${error}` });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    // Find conversation between the two users
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] },
    });

    if (!conversation) {
      return res.status(200).json([]); // No messages yet
    }

    // Get all messages in this conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .populate("sender", "userName profileImage")
      .populate("receiver", "userName profileImage")
      .sort({ createdAt: 1 });

    // Mark messages as read if current user is the receiver
    await Message.updateMany(
      {
        conversationId: conversation._id,
        receiver: currentUserId,
        read: false,
      },
      { read: true }
    );

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: `Cannot get messages: ${error}` });
  }
};

// Get online/suggested users to chat with
export const getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Get current user with following list
    const currentUser = await User.findById(currentUserId);

    // Get users the current user is following
    const users = await User.find({
      _id: { $in: currentUser.following },
    }).select("userName profileImage bio");

    return res.status(200).json(users);
  } catch (error) {
    console.error("Get chat users error:", error);
    return res.status(500).json({ message: `Cannot get users: ${error}` });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is part of this conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json({ message: "Conversation deleted" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res
      .status(500)
      .json({ message: `Cannot delete conversation: ${error}` });
  }
};
