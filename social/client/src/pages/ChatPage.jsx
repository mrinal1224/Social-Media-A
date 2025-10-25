import React, { useState, useEffect, useCallback, useRef } from 'react';
// FIX: Added file extension (.jsx)
import useChatSocket from '../../hooks/useChatSocket.jsx'; 
import { 
    fetchChats, 
    accessChat, 
    fetchMessages, 
    sendMessage 
// FIX: Added file extension (.js)
} from '../../apiCalls/chatApi.js'; 

// --- Placeholder for User Context (Replace with your actual Auth/User Context) ---
// This assumes your user object has an _id and a username/name field.
const useAuth = () => {
    // NOTE: REPLACE THIS DUMMY DATA with your actual authentication logic
    const userId = '65f37d37e6f36a54e60156d9'; // Dummy current user ID
    const userName = 'AliceCurrentUser';
    const isAuthenticated = !!userId;

    // Simulate finding the recipient's name from the chat members list
    const getRecipientName = (chat) => {
        if (!chat || !chat.users) return 'Unknown';
        const recipient = chat.users.find(u => u._id !== userId);
        return recipient ? recipient.username : 'Group Chat';
    };

    return { userId, userName, isAuthenticated, getRecipientName };
};
// --------------------------------------------------------------------------------

// --- Reusable Components for the Page ---

// 1. Chat List Component (Left Pane)
const ChatList = ({ chats, selectedChat, onSelectChat, userId, getRecipientName }) => (
    <div className="w-full md:w-1/3 p-4 border-r border-gray-200 bg-white overflow-y-auto h-full">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 border-b pb-2">Chats</h2>
        {chats.length === 0 ? (
            <p className="text-gray-500">No active chats. Start one!</p>
        ) : (
            chats.map((chat) => (
                <div
                    key={chat._id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition duration-150 ease-in-out shadow-sm
                        ${selectedChat?._id === chat._id 
                            ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                            : 'bg-gray-50 hover:bg-indigo-50 hover:shadow-sm'
                        }`}
                    onClick={() => onSelectChat(chat)}
                >
                    <div className="flex justify-between items-center">
                        <span className="truncate">
                            {getRecipientName(chat)}
                        </span>
                        {/* Placeholder for last message/timestamp */}
                    </div>
                </div>
            ))
        )}
    </div>
);

// 2. Chat Box Component (Right Pane)
const ChatBox = ({ 
    chat, 
    messages, 
    onSendMessage, 
    userId, 
    getRecipientName, 
    isLoadingMessages 
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (input.trim() && chat) {
            onSendMessage(chat._id, input.trim());
            setInput('');
        }
    };

    // Scroll to the latest message whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!chat) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-500 p-8 rounded-xl bg-white shadow-lg">
                    Select a conversation to start chatting.
                </p>
            </div>
        );
    }

    const recipientName = getRecipientName(chat);

    return (
        <div className="flex-1 flex flex-col bg-gray-100 h-full">
            <header className="p-4 bg-white border-b border-gray-200 shadow-md">
                <h3 className="text-xl font-bold text-gray-800">Chat with {recipientName}</h3>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={messagesEndRef}>
                {isLoadingMessages ? (
                    <div className="text-center text-gray-500">Loading messages...</div>
                ) : messages.map((m) => (
                    <div 
                        key={m._id || m.tempId} // Use tempId for optimistically sent messages
                        className={`flex ${m.sender === userId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md 
                            ${m.sender === userId 
                                ? 'bg-indigo-500 text-white rounded-br-none' 
                                : 'bg-gray-300 text-gray-800 rounded-tl-none'
                            }`}
                        >
                            <p className="text-sm break-words">{m.content}</p>
                            <span className={`text-xs mt-1 block ${m.sender === userId ? 'text-indigo-200' : 'text-gray-600'}`}>
                                {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shadow-inner flex space-x-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={!chat}
                />
                <button
                    onClick={handleSend}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition duration-150 ease-in-out disabled:opacity-50"
                    disabled={!chat || input.trim().length === 0}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

// --- Main Chat Page Component ---

const ChatPage = () => {
    // State for all chats, the selected chat, and the messages in the selected chat
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Get user context and socket functionality
    const { userId, isAuthenticated, getRecipientName } = useAuth();
    const { socket, isConnected, joinChat, realtimeMessages, clearRealtimeMessages } = useChatSocket();

    // 1. Initial Fetch of Chats
    useEffect(() => {
        if (isAuthenticated && userId) {
            const getChats = async () => {
                try {
                    const data = await fetchChats();
                    setChats(data);
                } catch (err) {
                    console.error("Could not fetch chats:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            getChats();
        }
    }, [isAuthenticated, userId]);

    // 2. Handler for selecting a new chat
    const handleSelectChat = useCallback(async (chat) => {
        if (!chat || chat._id === selectedChat?._id) return;

        setSelectedChat(chat);
        clearRealtimeMessages(); // Clear any buffered messages from previous chats
        setIsLoadingMessages(true);

        try {
            // 2a. Fetch historical messages
            const historicalMessages = await fetchMessages(chat._id);
            setMessages(historicalMessages);

            // 2b. Tell the server we are joining this chat's room
            if (isConnected) {
                joinChat(chat._id);
            }
        } catch (err) {
            console.error("Error setting up chat:", err);
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    }, [selectedChat, isConnected, joinChat, clearRealtimeMessages]);

    // 3. Real-time Message Listener
    useEffect(() => {
        if (realtimeMessages.length > 0) {
            const latestMessage = realtimeMessages[realtimeMessages.length - 1];

            // Check if the incoming message belongs to the currently selected chat
            if (selectedChat && latestMessage.chatId === selectedChat._id) {
                // Remove the optimistic update if this is the real message coming back
                setMessages(prev => {
                    // Check if a message with the temporary ID exists and remove it
                    const filteredMessages = prev.filter(m => m.tempId !== latestMessage.tempId);

                    // Add the real message
                    return [...filteredMessages, latestMessage];
                });
            } else if (latestMessage.chatId) {
                // If the message is for a different chat, update the chat list (e.g., move to top)
                // This is a more advanced feature left for later, but crucial for UX.
                // For now, just log it.
                console.log(`New message received for chat ${latestMessage.chatId}`);
            }
        }
    }, [realtimeMessages, selectedChat]);


    // 4. Send Message Handler
    const handleSendMessage = useCallback(async (chatId, content) => {
        const tempId = Date.now();

        // Optimistic UI Update: Show the message immediately
        const optimisticMessage = {
            _id: tempId, // Use tempId for unique key before server response
            tempId: tempId,
            sender: userId,
            content: content,
            chatId: chatId,
            createdAt: new Date().toISOString(),
            // status: 'sending' // Can be used to show a loading indicator
        };

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            // 4a. Persist the message via HTTP
            const savedMessage = await sendMessage(chatId, content);

            // 4b. Emit the message over Socket.io to the recipient(s)
            if (socket && isConnected) {
                socket.emit('new_message', { 
                    ...savedMessage, 
                    tempId: tempId // Include tempId for server to echo back (optional but helpful)
                });
            }

            // The real-time listener (useEffect 3) will handle replacing the optimistic message
            // when the server echoes the message back via 'message_received'.

        } catch (error) {
            console.error("Failed to send message:", error);
            // Revert optimistic update and show error state
            setMessages(prev => prev.filter(m => m.tempId !== tempId));
            // Add error handling (e.g., a toast notification)
        }
    }, [userId, socket, isConnected]);


    if (!isAuthenticated) {
        return <div className="p-8 text-center text-red-500">Please log in to use the chat feature.</div>;
    }

    if (isLoading) {
        return <div className="p-8 text-center text-indigo-600">Loading chats...</div>;
    }

    return (
        <div className="flex flex-col h-screen max-h-screen antialiased bg-gray-50 rounded-xl shadow-2xl overflow-hidden">
            <header className="p-4 bg-white border-b shadow-sm">
                <h1 className="text-3xl font-extrabold text-indigo-700">Real-time Messenger</h1>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane: Chat List */}
                <ChatList
                    chats={chats}
                    selectedChat={selectedChat}
                    onSelectChat={handleSelectChat}
                    userId={userId}
                    getRecipientName={getRecipientName}
                />

                {/* Right Pane: Chat Box */}
                <ChatBox
                    chat={selectedChat}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    userId={userId}
                    getRecipientName={getRecipientName}
                    isLoadingMessages={isLoadingMessages}
                />
            </div>
        </div>
    );
};

export default ChatPage;