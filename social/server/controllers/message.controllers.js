import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType = "text", mediaUrl = "" } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver and content are required" });
    }

    // Generate conversation ID
    const conversationId = Message.getConversationId(senderId, receiverId);

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType,
      mediaUrl,
      conversationId,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "userName name profileImage")
      .populate("receiver", "userName name profileImage");

    return res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: `Cannot send message: ${error.message}` });
  }
};

// Get messages for a conversation
export const getConversationMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params;
    const currentUserId = req.userId;

    const conversationId = Message.getConversationId(currentUserId, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate("sender", "userName name profileImage")
      .populate("receiver", "userName name profileImage")
      .sort({ createdAt: 1 }); // Oldest first for conversation view

    // Mark messages as read when fetching conversation
    await Message.updateMany(
      { conversationId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Get conversation messages error:", error);
    return res.status(500).json({ message: `Cannot get messages: ${error.message}` });
  }
};

// Get all conversations for current user
export const getUserConversations = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Find all unique conversations where user is sender or receiver
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: currentUserId },
            { receiver: currentUserId }
          ]
        }
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [
                  { $eq: ["$receiver", currentUserId] },
                  { $eq: ["$isRead", false] }
                ]},
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      },
      {
        $limit: 50 // Limit to recent conversations
      }
    ]);

    // Get the other user for each conversation
    const conversationData = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.lastMessage.sender.toString() === currentUserId.toString()
          ? conv.lastMessage.receiver
          : conv.lastMessage.sender;

        const otherUser = await User.findById(otherUserId, "userName name profileImage");

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage: {
            content: conv.lastMessage.content,
            messageType: conv.lastMessage.messageType,
            createdAt: conv.lastMessage.createdAt,
            sender: conv.lastMessage.sender,
          },
          unreadCount: conv.unreadCount,
        };
      })
    );

    return res.status(200).json(conversationData);
  } catch (error) {
    console.error("Get user conversations error:", error);
    return res.status(500).json({ message: `Cannot get conversations: ${error.message}` });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const currentUserId = req.userId;

    const result = await Message.updateMany(
      { conversationId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      message: "Messages marked as read",
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Mark messages as read error:", error);
    return res.status(500).json({ message: `Cannot mark messages as read: ${error.message}` });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const currentUserId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only allow sender to delete their messages
    if (message.sender.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    return res.status(500).json({ message: `Cannot delete message: ${error.message}` });
  }
};
