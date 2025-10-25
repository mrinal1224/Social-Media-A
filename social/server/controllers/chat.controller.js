import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js'; // Assuming you have a User model
import { io } from '../index.js'; // Import the Socket.io instance from index.js

/**
 * @desc    Access a chat (create if it doesn't exist) with another user
 * @route   POST /api/chat/
 * @access  Private
 */
export const accessChat = async (req, res) => {
    const { userId } = req.body;
    const currentUserId = req.user._id;

    if (!userId) {
        console.log("Partner userId param not sent with request");
        return res.sendStatus(400);
    }

    // Check if a chat already exists between these two users
    let chat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            { members: { $elemMatch: { $eq: currentUserId } } },
            { members: { $elemMatch: { $eq: userId } } },
        ],
    })
    .populate("members", "-password") // Populate member data, excluding password
    .populate("lastMessage"); 

    // If chat exists, populate the last message sender
    if (chat) {
        chat = await User.populate(chat, {
            path: 'lastMessage.sender',
            select: 'username profilePicture',
        });
        return res.status(200).send(chat);
    } 

    // If chat does not exist, create a new one
    try {
        const newChat = await Chat.create({
            members: [currentUserId, userId],
            chatName: 'sender', // Not used for 1-on-1, but required by schema
        });

        // Fetch the newly created chat with populated user data
        const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
            "members",
            "-password"
        );

        res.status(200).json(fullChat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Fetch all chats for the logged in user
 * @route   GET /api/chat/
 * @access  Private
 */
export const getChats = async (req, res) => {
    try {
        let chats = await Chat.find({ members: { $elemMatch: { $eq: req.user._id } } })
            .populate("members", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 }); // Show most recently updated chats first

        // Populate sender details for the last message
        chats = await User.populate(chats, {
            path: 'lastMessage.sender',
            select: 'username profilePicture',
        });

        res.status(200).send(chats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @desc    Send a new message in a chat
 * @route   POST /api/chat/message
 * @access  Private
 */
export const sendMessage = async (req, res) => {
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    if (!chatId || !content) {
        return res.status(400).json({ message: "Invalid data passed into request" });
    }

    try {
        // 1. Create and save the new message
        let newMessage = await Message.create({
            sender: senderId,
            text: content,
            chatId: chatId,
        });

        // 2. Populate the sender details on the message object
        newMessage = await newMessage.populate("sender", "username profilePicture");
        newMessage = await newMessage.populate("chatId");

        // 3. Update the Chat model with the lastMessage reference
        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: newMessage,
        });

        // 4. Send the message to all members of the chat in real-time
        const chat = await Chat.findById(chatId);

        if (chat && chat.members) {
            // Emit the message to all members of the chat room (except the sender)
            // You would typically implement 'join_chat' socket logic to join users to rooms
            // For now, we'll just broadcast
            chat.members.forEach(memberId => {
                // Do not send the message back to the user who sent it, as they already see it instantly
                if (memberId.toString() !== senderId.toString()) {
                    // This assumes the client will emit an event to the server to join a room named after their userId
                    io.to(memberId.toString()).emit('message_received', newMessage);
                }
            });
        }


        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * @desc    Fetch all messages for a specific chat
 * @route   GET /api/chat/message/:chatId
 * @access  Private
 */
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate("sender", "username profilePicture")
            .populate("chatId"); // Optional: populate chat details

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};