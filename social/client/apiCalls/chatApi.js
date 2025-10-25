const API_BASE_URL = "http://localhost:8000/api/chat"; // Base URL for chat routes

// NOTE: This implementation assumes you have an 'axios' or similar library 
// configured with authentication (e.g., sending cookies or Auth headers).
// Replace 'axios' with your actual HTTP client implementation.

/**
 * Fetches all conversations (chats) for the currently logged-in user.
 * GET /api/chat/
 */
export const fetchChats = async () => {
    try {
        // Replace with your actual authenticated fetch/axios call
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                // Assuming your authentication token is stored and accessible
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user chats');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching chats:", error);
        throw error;
    }
};


/**
 * Accesses or creates a 1-on-1 chat with a specific user.
 * POST /api/chat/
 * @param {string} userId - The ID of the user to chat with.
 */
export const accessChat = async (userId) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            throw new Error('Failed to access or create chat');
        }

        const data = await response.json();
        return data; // Returns the full Chat object
    } catch (error) {
        console.error("Error accessing chat:", error);
        throw error;
    }
};

/**
 * Fetches all historical messages for a given chat ID.
 * GET /api/chat/message/:chatId
 * @param {string} chatId - The ID of the conversation.
 */
export const fetchMessages = async (chatId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/message/${chatId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        return data; // Returns an array of Message objects
    } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        throw error;
    }
};

/**
 * Sends and persists a new message to the server.
 * POST /api/chat/message
 * @param {string} chatId - The ID of the chat the message belongs to.
 * @param {string} content - The text content of the message.
 */
export const sendMessage = async (chatId, content) => {
    try {
        const response = await fetch(`${API_BASE_URL}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ chatId, content }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const data = await response.json();
        return data; // Returns the newly created Message object
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};