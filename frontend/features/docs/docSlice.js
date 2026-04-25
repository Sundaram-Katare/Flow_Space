import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  docs: [],
  currentDoc: null,
  isLoading: false,
  error: null,
  activeUsers: [], 
  typingUsers: {}, 
};

const docSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    setDocs: (state, action) => {
      state.docs = action.payload;
    },

    addDoc: (state, action) => {
      state.docs.push(action.payload);
    },

    setCurrentDoc: (state, action) => {
      state.currentDoc = action.payload;
      state.activeUsers = [];
      state.typingUsers = {};
    },

    updateDocTitle: (state, action) => {
      const { docId, title } = action.payload;
      const doc = state.docs.find((d) => d.id === docId);
      if (doc) {
        doc.title = title;
      }
      if (state.currentDoc?.id === docId) {
        state.currentDoc.title = title;
      }
    },

    updateBlock: (state, action) => {
      const { blockId, blockData } = action.payload;
      if (state.currentDoc?.content?.blocks) {
        const block = state.currentDoc.content.blocks.find(
          (b) => b.id === blockId
        );
        if (block) {
          Object.assign(block, blockData);
        }
      }
    },

    addBlock: (state, action) => {
      const { block, afterBlockId } = action.payload;
      if (!state.currentDoc?.content) return;

      if (afterBlockId) {
        const index = state.currentDoc.content.blocks.findIndex(
          (b) => b.id === afterBlockId
        );
        if (index !== -1) {
          state.currentDoc.content.blocks.splice(index + 1, 0, block);
        } else {
          state.currentDoc.content.blocks.push(block);
        }
      } else {
        state.currentDoc.content.blocks.push(block);
      }
    },

    deleteBlock: (state, action) => {
      const blockId = action.payload;
      if (state.currentDoc?.content) {
        state.currentDoc.content.blocks = state.currentDoc.content.blocks.filter(
          (b) => b.id !== blockId
        );
      }
    },

    deleteDoc: (state, action) => {
      const docId = action.payload;
      state.docs = state.docs.filter((d) => d.id !== docId);
      if (state.currentDoc?.id === docId) {
        state.currentDoc = null;
      }
    },

    addActiveUser: (state, action) => {
      const { userId, username } = action.payload;
      if (!state.activeUsers.find((u) => u.userId === userId)) {
        state.activeUsers.push({ userId, username });
      }
    },

    removeActiveUser: (state, action) => {
      const userId = action.payload;
      state.activeUsers = state.activeUsers.filter((u) => u.userId !== userId);
      delete state.typingUsers[userId];
    },

    setTypingUser: (state, action) => {
      const { userId, blockId, position } = action.payload;
      state.typingUsers[userId] = { blockId, position };
    },

    removeTypingUser: (state, action) => {
      const userId = action.payload;
      delete state.typingUsers[userId];
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearDocs: (state) => {
      state.docs = [];
      state.currentDoc = null;
      state.activeUsers = [];
      state.typingUsers = {};
    },
  },
});

export const {
  setDocs,
  addDoc,
  setCurrentDoc,
  updateDocTitle,
  updateBlock,
  addBlock,
  deleteBlock,
  deleteDoc,
  addActiveUser,
  removeActiveUser,
  setTypingUser,
  removeTypingUser,
  setIsLoading,
  setError,
  clearDocs,
} = docSlice.actions;

export default docSlice.reducer;