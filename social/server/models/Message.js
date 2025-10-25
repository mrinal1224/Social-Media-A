import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
    {
        // Reference to the Chat/Conversation this message belongs to
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
            required: true,
        },

        // Reference to the user who sent the message
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming your user model is named 'User'
            required: true,
        },

        // The content of the message
        text: {
            type: String,
            trim: true,
            required: true,
        },

        // Optional field for message read status (useful for marking messages as read by recipients)
        readBy: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            default: [],
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt timestamps
    }
);

const Message = mongoose.model('Message', MessageSchema);
export default Message;