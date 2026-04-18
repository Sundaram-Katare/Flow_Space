import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  addTypingUser,
  removeTypingUser,
  deleteMessage as deleteMessageAction,
} from "../../../features/chat/chatSlice.js";
import {
  sendMessage,
  sendTyping,
  sendStopTyping,
  onMessageReceived,
  onUserTyping,
  onUserStopTyping,
} from "../../services/socket.js";
import { deleteMessageAPI } from "../../services/chat.js";

export default function ChatUI({ channel }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, typingUsers } = useSelector((state) => state.chat);

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup Socket.io listeners
  useEffect(() => {
    // Listen for incoming messages
    onMessageReceived((messageData) => {
      dispatch(addMessage(messageData));
    });

    // Listen for typing indicators
    onUserTyping((data) => {
      dispatch(addTypingUser(data));
    });

    onUserStopTyping((data) => {
      dispatch(removeTypingUser(data.userId));
    });

    return () => {
      // Cleanup listeners
    };
  }, [dispatch]);

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!messageText.trim()) return;

    // Send via Socket.io
    sendMessage(channel.id, messageText);

    // Clear input
    setMessageText("");
    setIsTyping(false);
    sendStopTyping(channel.id);
  };

  // Handle typing indicator
  const handleInputChange = (e) => {
    setMessageText(e.target.value);

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTyping(channel.id);
    }

    // Reset typing timeout
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendStopTyping(channel.id);
    }, 3000);
  };

  // Handle message delete
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageAPI(messageId);
      dispatch(deleteMessageAction(messageId));
    } catch (err) {
      alert("Failed to delete message");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Channel Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <h2 className="text-xl font-bold">#{channel?.name}</h2>
        {channel?.description && (
          <p className="text-sm opacity-90">{channel?.description}</p>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
                  msg.userId === user?.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm font-semibold">{msg.username}</p>
                <p className="text-sm mt-1">{msg.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                  {msg.userId === user?.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="ml-2 text-xs hover:opacity-70"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-sm">
              {typingUsers.map((u) => u.username).join(", ")} typing...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}