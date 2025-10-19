import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  mediaUrl: {
    type: String,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  conversationId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create compound index for efficient conversation queries
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Static method to generate conversation ID between two users
messageSchema.statics.getConversationId = function(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
};

const Message = mongoose.model("message", messageSchema);

export default Message;