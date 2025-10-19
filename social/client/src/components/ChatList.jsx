import React, { useState, useEffect } from 'react';

const ChatList = ({ conversations, onSelectChat, selectedChat }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="w-full h-[70px] flex items-center px-6 border-b border-neutral-200">
        <h1 className="text-neutral-800 text-lg font-semibold">Messages</h1>
      </div>

      {/* Online Users */}
      <div className="w-full h-[80px] flex gap-4 items-center overflow-x-auto px-6 py-3 border-b border-neutral-200">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-[50px] h-[50px] rounded-full bg-green-400 flex items-center justify-center">
            <span className="text-white text-sm font-medium">Y</span>
          </div>
          <p className="text-xs text-neutral-500">You</p>
        </div>
        {Array(5)
          .fill("")
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="w-[50px] h-[50px] rounded-full bg-neutral-300 flex items-center justify-center">
                <span className="text-neutral-600 text-sm font-medium">
                  U{i + 1}
                </span>
              </div>
              <p className="text-xs text-neutral-500">User {i + 1}</p>
            </div>
          ))}
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {conversations.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No conversations yet</p>
            <p className="text-sm">Start a conversation with someone!</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.conversationId}
              onClick={() => onSelectChat(conversation)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChat?.conversationId === conversation.conversationId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-neutral-100'
              }`}
            >
              <div className="relative">
                <div className="w-[50px] h-[50px] rounded-full bg-neutral-300 flex items-center justify-center">
                  {conversation.otherUser.profileImage ? (
                    <img
                      src={conversation.otherUser.profileImage}
                      alt={conversation.otherUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-neutral-600 text-sm font-medium">
                      {conversation.otherUser.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">
                  {conversation.otherUser.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {conversation.lastMessage.content}
                </p>
              </div>
              <div className="text-xs text-neutral-400">
                {formatTime(conversation.lastMessage.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
