import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        // Array of user IDs participating in the chat. 
        // For a 1-on-1 chat, this array will contain exactly two user IDs.
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User', // Assuming your user model is named 'User'
            required: true,
            validate: {
                validator: (v) => v.length >= 2, // Ensure at least two members for a chat
                message: props => `${props.value} must contain at least two members!`
            }
        },

        // Reference to the most recent message in the chat for quick display
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null, // Null if no messages have been sent yet
        },

        // Useful for group chats later, but optional for 1-on-1
        chatName: {
            type: String,
            trim: true,
            default: '',
        },

        isGroupChat: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt timestamps
    }
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;