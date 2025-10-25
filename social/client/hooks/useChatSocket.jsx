import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';

// Define the server URL based on the constant defined in your server's index.js
const SERVER_URL = 'http://localhost:8000'; 

// --- Dummy Auth Context for demonstration ---
// Replace this with your actual Auth Context hook/function to get the current user ID
const useAuth = () => {
    // In a real app, this would return the authenticated user's ID
    const [userId, setUserId] = useState('65f37d37e6f36a54e60156d9'); // Replace with a real User ID from your system
    return { userId, isAuthenticated: !!userId };
};
// --- End Dummy Auth Context ---

const useChatSocket = () => {
    const { userId, isAuthenticated } = useAuth(); // Get authenticated user ID
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]); // State to hold incoming real-time messages

    // 1. Initialize and Connect Socket
    useEffect(() => {
        if (!isAuthenticated || !userId) {
            if (socketRef.current) socketRef.current.close();
            return;
        }

        // Connect only if a user is authenticated
        if (!socketRef.current) {
            const socket = io(SERVER_URL, {
                query: { userId }, // Send user ID for server-side room joining
                withCredentials: true,
            });

            socketRef.current = socket;

            socket.on('connect', () => {
                setIsConnected(true);
                console.log(`Socket Connected: ${socket.id} (User: ${userId})`);
            });

            socket.on('disconnect', () => {
                setIsConnected(false);
                console.log('Socket Disconnected');
            });

            // 2. Listener for incoming messages from the server
            socket.on('message_received', (newMessage) => {
                console.log('Real-time message received:', newMessage);
                // When a message is received, update the messages state
                // Note: You will handle which chat this message belongs to in the component that uses this hook
                setMessages(prev => [...prev, newMessage]);
            });

            return () => {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('message_received');
                socket.close();
                socketRef.current = null;
            };
        }
    }, [userId, isAuthenticated]);


    // 3. Emitter: Function to join a specific chat room
    const joinChat = useCallback((chatId) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit('join_chat', chatId);
        } else {
            console.error("Socket not connected or not initialized.");
        }
    }, [isConnected]);

    // 4. Emitter: Function to clear buffered real-time messages (useful when changing chats)
    const clearRealtimeMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        socket: socketRef.current,
        isConnected,
        joinChat,
        realtimeMessages: messages,
        clearRealtimeMessages,
    };
};

export default useChatSocket;