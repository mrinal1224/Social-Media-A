import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const Chat = ({ otherUser, conversationId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { userData } = useSelector(state => state.user);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchMessages();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/message/conversation/${otherUser._id}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/message/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          receiverId: otherUser._id,
          content: newMessage,
          messageType: 'text'
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="w-full h-[70px] flex items-center px-6 border-b border-neutral-200 bg-white">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px] rounded-full bg-gray-300 flex items-center justify-center">
            {otherUser.profileImage ? (
              <img
                src={otherUser.profileImage}
                alt={otherUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {otherUser.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{otherUser.name}</h3>
            <p className="text-sm text-gray-500">@{otherUser.userName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender._id === userData._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === userData._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender._id === userData._id
                      ? 'text-blue-100'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="w-full p-4 bg-white border-t border-neutral-200">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
