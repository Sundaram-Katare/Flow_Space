import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  currentChannel: null,
  messages: [],
  typingUsers: [], // Users currently typing
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Channels
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
      state.messages = []; // Clear messages when switching channel
    },

    // Messages
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },

    // Typing indicator
    addTypingUser: (state, action) => {
      if (!state.typingUsers.find((u) => u.userId === action.payload.userId)) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(
        (u) => u.userId !== action.payload
      );
    },

    // Loading & Error
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Logout
    clearChat: (state) => {
      state.channels = [];
      state.currentChannel = null;
      state.messages = [];
      state.typingUsers = [];
    },
  },
});

export const {
  setChannels,
  addChannel,
  setCurrentChannel,
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  addTypingUser,
  removeTypingUser,
  setIsLoading,
  setError,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;