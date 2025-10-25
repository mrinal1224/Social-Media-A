import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  getChatUsers 
} from "../../apiCalls/authCalls";
import { BiArrowBack, BiSend } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";

function Messages() {
  const { userData } = useSelector((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch conversations and chat users on mount
  useEffect(() => {
    fetchConversations();
    fetchChatUsers();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchChatUsers = async () => {
    try {
      const data = await getChatUsers();
      setChatUsers(data);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  };

  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const data = await getMessages(userId);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const message = await sendMessage(selectedUser._id, newMessage);
      setMessages([...messages, message]);
      setNewMessage("");
      fetchConversations(); // Refresh conversations
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find(p => p._id !== userData._id);
  };

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = getOtherUser(conv);
    return otherUser?.userName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredChatUsers = chatUsers.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar - Conversations List */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-[350px] flex-col border-r border-neutral-200 bg-white`}>
        {/* Header */}
        <div className="w-full h-[70px] flex items-center justify-between px-6 border-b border-neutral-200">
          <h1 className="text-neutral-800 text-xl font-semibold">Messages</h1>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-neutral-200">
          <div className="relative">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Online/Following Users */}
        {chatUsers.length > 0 && !searchTerm && (
          <div className="w-full px-4 py-3 border-b border-neutral-200">
            <p className="text-xs font-semibold text-neutral-500 mb-3">FOLLOWING</p>
            <div className="flex gap-3 overflow-x-auto">
              {chatUsers.slice(0, 8).map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
                >
                  <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-purple-400 to-pink-400 p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={user.profileImage || `https://ui-avatars.com/api/?name=${user.userName}&background=random`}
                        alt={user.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-600 max-w-[60px] truncate">
                    {user.userName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {searchTerm && filteredChatUsers.length > 0 && (
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-neutral-500 mb-2">PEOPLE</p>
              {filteredChatUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 cursor-pointer transition"
                >
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-neutral-300">
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${user.userName}&background=random`}
                      alt={user.userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">
                      {user.userName}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-neutral-500 truncate">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredConversations.length > 0 ? (
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-neutral-500 mb-2">MESSAGES</p>
              {filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                return (
                  <div
                    key={conversation._id}
                    onClick={() => handleSelectUser(otherUser)}
                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-100 cursor-pointer transition ${
                      selectedUser?._id === otherUser._id ? 'bg-neutral-100' : ''
                    }`}
                  >
                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-neutral-300">
                      <img
                        src={otherUser.profileImage || `https://ui-avatars.com/api/?name=${otherUser.userName}&background=random`}
                        alt={otherUser.userName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800">
                        {otherUser.userName}
                      </p>
                      {conversation.lastMessage && (
                        <p className="text-xs text-neutral-500 truncate">
                          {conversation.lastMessage.sender._id === userData._id ? 'You: ' : ''}
                          {conversation.lastMessage.text}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {new Date(conversation.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !searchTerm && (
              <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                <p className="text-neutral-400 text-sm mb-2">No conversations yet</p>
                <p className="text-neutral-400 text-xs">
                  Select a user above to start chatting
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-neutral-50`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="w-full h-[70px] flex items-center gap-3 px-6 border-b border-neutral-200 bg-white">
              <button
                onClick={() => setSelectedUser(null)}
                className="md:hidden text-neutral-600 hover:text-neutral-800"
              >
                <BiArrowBack size={24} />
              </button>
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden bg-neutral-300">
                <img
                  src={selectedUser.profileImage || `https://ui-avatars.com/api/?name=${selectedUser.userName}&background=random`}
                  alt={selectedUser.userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-neutral-800">
                  {selectedUser.userName}
                </p>
                <p className="text-xs text-neutral-500">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-neutral-400">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isOwn = message.sender._id === userData._id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                          <div className="w-[35px] h-[35px] rounded-full overflow-hidden bg-neutral-300 shrink-0">
                            <img
                              src={message.sender.profileImage || `https://ui-avatars.com/api/?name=${message.sender.userName}&background=random`}
                              alt={message.sender.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-neutral-800 border border-neutral-200'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                            </div>
                            <p className="text-xs text-neutral-400 mt-1 px-2">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-neutral-400">No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="w-full px-6 py-4 border-t border-neutral-200 bg-white"
            >
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-full focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="w-[45px] h-[45px] bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <BiSend size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center px-8">
              <div className="w-[120px] h-[120px] rounded-full bg-neutral-200 mx-auto mb-4 flex items-center justify-center">
                <BiSend size={50} className="text-neutral-400" />
              </div>
              <h2 className="text-2xl font-semibold text-neutral-800 mb-2">
                Your Messages
              </h2>
              <p className="text-neutral-500">
                Send private messages to people you follow
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;