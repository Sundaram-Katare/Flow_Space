import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  MoreVertical,
  Plus,
  Smile,
  Hash,
  Users,
  Search,
  Phone,
  Video,
  Info,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  addMessage,
  addTypingUser,
  removeTypingUser,
  setMessages,
  deleteMessage as deleteMessageAction,
} from "../../../features/chat/chatSlice.js";
import {
  sendMessage,
  sendTyping,
  sendStopTyping,
  onMessageReceived,
  onUserTyping,
  joinChannel,
  leaveChannel,
  removeEventListener,
} from "../../services/socket.js";
import { deleteMessageAPI, getMessages } from "../../services/chat.js";
import CreateTaskForm from "./CreateTaskForm";

export default function ChatUI({ channel, workspaceId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { messages, typingUsers } = useSelector((state) => state.chat);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (!channel?.id) return;

    const loadChannelData = async () => {
      try {
        // Fetch existing messages
        const data = await getMessages(channel.id);
        // Normalize messages: ensure consistent camelCase field names
        const normalizedMessages = (data.messages || []).map(msg => ({
          id: msg.id,
          userId: msg.userId || msg.user_id,
          channelId: msg.channelId || msg.channel_id,
          username: msg.username,
          content: msg.content,
          created_at: msg.created_at,
          profile_picture: msg.profile_picture,
        }));
        dispatch(setMessages(normalizedMessages));

        // Join socket room
        joinChannel(channel.id);
      } catch (err) {
        console.error("Failed to load channel data:", err);
      }
    };

    loadChannelData();

    return () => {
      leaveChannel(channel.id);
      dispatch(setMessages([]));
    };
  }, [channel?.id, dispatch]);

  useEffect(() => {
    const handleMessageReceived = (messageData) => {
      // Only add if message belongs to current channel
      const msgChannelId = messageData.channelId || messageData.channel_id;
      if (msgChannelId === channel?.id) {
        dispatch(addMessage(messageData));
      }
    };

    const handleUserTyping = (data) => {
      if (data.channelId === channel?.id) {
        dispatch(addTypingUser(data));
        // Clear after 3 seconds with unique timeout per user
        const timeoutId = setTimeout(() => {
          dispatch(removeTypingUser(data.userId));
        }, 3000);
        return () => clearTimeout(timeoutId);
      }
    };

    if (!channel?.id) return;

    // Clear any existing listeners first
    removeEventListener("message-received");
    removeEventListener("user-typing");

    // Register fresh listeners for this channel
    onMessageReceived(handleMessageReceived);
    onUserTyping(handleUserTyping);

    // Cleanup: Remove listeners when component unmounts or channel changes
    return () => {
      removeEventListener("message-received");
      removeEventListener("user-typing");
    };
  }, [dispatch, channel?.id]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();
    if (!messageText.trim() || !channel?.id) return;
    sendMessage(channel.id, messageText);
    setMessageText("");
    setIsTyping(false);
    sendStopTyping(channel.id);
  }, [messageText, channel?.id]);

  const handleInputChange = useCallback((e) => {
    setMessageText(e.target.value);
    if (!channel?.id) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTyping(channel.id);
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendStopTyping(channel.id);
    }, 3000);
  }, [channel?.id, isTyping]);

  const handleConvertToTask = (message) => {
    setSelectedMessage(message);
    setShowTaskModal(true);
  };

  const handleCreateTaskFromMessage = useCallback(async (title, description, priority, assignedTo) => {
  try {
    const { createTask } = await import("../../services/tasks.js");
    await createTask(workspaceId, title, description, priority, assignedTo);
    
    // Close modal
    setShowTaskModal(false);
    setSelectedMessage(null);
    
    // Optional: Show toast notification (if your app has one)
    console.log("✅ Task created from message successfully!");
  } catch (err) {
    console.error("Failed to create task:", err);
  }
}, [workspaceId]);


  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await deleteMessageAPI(messageId);
      dispatch(deleteMessageAction(messageId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [dispatch]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold">
            <Hash size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {channel?.name || "Select a channel"}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              {/* <span className="flex items-center gap-1">
                <Users size={12} /> {channel}
              </span> */}
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span>{channel?.description || "No description set"}</span>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-1 md:gap-4">
          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
            <Phone size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all hidden md:flex">
            <Video size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
            <Search size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <Info size={20} />
          </button>
        </div> */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-4">
              {/* <Hash size={40} /> */}
              <img src="https://media.lordicon.com/icons/wired/flat/2149-hashtag.gif" alt="" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Beginning of #{channel?.name}</h3>
            <p className="text-slate-500 max-w-xs mt-2">This is the start of the #{channel?.name} channel. Send a message to get things started!</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isMe = msg.userId === user?.id;
                const showAvatar = idx === 0 || messages[idx - 1].userId !== msg.userId;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-end gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {!isMe && (
                      <div className={`w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white shadow-sm flex-shrink-0 ${!showAvatar && "opacity-0"}`}>
                        {msg.username?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className={`group flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%] lg:max-w-[60%]`}>
                      {showAvatar && (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                          {isMe ? "You" : msg.username} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}

                      <div className={`relative px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed transition-all group/message ${isMe
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-700 rounded-bl-none"
                        }`}>
                        {msg.content}

                        {/* Buttons on hover */}
                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity flex gap-2 p-1">
                          {/* Convert to Task - Show on ALL messages */}
                          <button
                            onClick={() => handleConvertToTask(msg)}
                            className={`p-1.5 rounded-lg transition-all ${isMe
                              ? "text-white hover:bg-white/20"
                              : "text-black hover:bg-slate-200 hover:text-teal-950"
                              }`}
                            title="Convert to task"
                          >
                            <ArrowRight size={14} />
                          </button>

                          {/* Delete - Only show on own messages */}
                          {isMe && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 text-white hover:bg-red-500/30 rounded-lg transition-all"
                              title="Delete message"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <div className="flex gap-1 bg-slate-100 px-2 py-1 rounded-full">
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>{typingUsers[0].username} is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0">
        <form
          onSubmit={handleSendMessage}
          className="bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 p-2 hover:border-teal-300 transition-colors focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 shadow-sm"
        >
          {/* <button type="button" className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
            <Plus size={20} />
          </button> */}
          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder={`Message #${channel?.name || "channel"}`}
            className="flex-1 bg-transparent py-2 px-1 text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1 pr-1">
            <button type="button" className="p-2 text-slate-400 hover:text-teal-600 transition-colors hidden sm:flex">
              <Smile size={20} />
            </button>
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:grayscale transition-all shadow-md shadow-teal-200"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
          Press <kbd className="bg-slate-100 px-1 rounded font-sans uppercase">Enter</kbd> to send
        </p>
      </div>

      {/* Task Creation Modal from Message */}
      {showTaskModal && selectedMessage && (
        <CreateTaskForm
          onCreate={async (title, description, priority, assignedTo) => {
            await handleCreateTaskFromMessage(title, description, priority, assignedTo);
          }}
          onCancel={() => {
            setShowTaskModal(false);
            setSelectedMessage(null);
          }}
          workspaceId={workspaceId}
          initialTitle={selectedMessage.content}
        />
      )}
    </div>
  );
}