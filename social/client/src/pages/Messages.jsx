import React, { useState, useEffect } from 'react';
import ChatList from '../components/ChatList.jsx';
import Chat from '../components/Chat.jsx';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/message/conversations', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = (conversation) => {
    setSelectedChat(conversation);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
    fetchConversations(); // Refresh conversations when going back
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      {/* Chat List - Hidden when chat is selected on mobile */}
      <div className={`w-full md:w-96 border-r border-neutral-200 ${selectedChat ? 'hidden md:block' : 'block'}`}>
        <ChatList
          conversations={conversations}
          onSelectChat={handleSelectChat}
          selectedChat={selectedChat}
        />
      </div>

      {/* Chat View - Show when chat is selected */}
      {selectedChat && (
        <Chat
          otherUser={selectedChat.otherUser}
          conversationId={selectedChat.conversationId}
          onBack={handleBackToList}
        />
      )}

      {/* Empty state when no chat selected on desktop */}
      {!selectedChat && (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
