import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  members: [],
  isLoading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    // Fetch workspaces
    fetchWorkspacesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchWorkspacesSuccess: (state, action) => {
      state.isLoading = false;
      state.workspaces = Array.isArray(action.payload) 
        ? action.payload 
        : (action.payload?.workspaces || []);
    },
    fetchWorkspacesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Create workspace
    createWorkspaceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createWorkspaceSuccess: (state, action) => {
      state.isLoading = false;
      state.workspaces.push(action.payload);
    },
    createWorkspaceFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Set current workspace
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },

    // Fetch workspace members
    fetchMembersStart: (state) => {
      state.isLoading = true;
    },
    fetchMembersSuccess: (state, action) => {
      state.isLoading = false;
      state.members = action.payload;
    },
    fetchMembersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Join workspace
    joinWorkspaceStart: (state) => {
      state.isLoading = true;
    },
    joinWorkspaceSuccess: (state, action) => {
      state.isLoading = false;
      state.workspaces.push(action.payload);
    },
    joinWorkspaceFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Leave workspace
    leaveWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );
      if (state.currentWorkspace?.id === action.payload) {
        state.currentWorkspace = null;
      }
    },

    // Logout
    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.currentWorkspace = null;
      state.members = [];
    },
  },
});

export const {
  fetchWorkspacesStart,
  fetchWorkspacesSuccess,
  fetchWorkspacesFailure,
  createWorkspaceStart,
  createWorkspaceSuccess,
  createWorkspaceFailure,
  setCurrentWorkspace,
  fetchMembersStart,
  fetchMembersSuccess,
  fetchMembersFailure,
  joinWorkspaceStart,
  joinWorkspaceSuccess,
  joinWorkspaceFailure,
  leaveWorkspace,
  clearWorkspaces,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;