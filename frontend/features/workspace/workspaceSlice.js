import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

const BACKEND_API = "http://localhost:5000/api";

const initialState = {
    workspaces: [],
    loading: false,
    error: null,
};

export const createWorkspace = createAsyncThunk(
    'workspace/create',
    async (workspaceData, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            };
            const response = await axios.post(`${BACKEND_API}/workspace/create`, workspaceData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUserWorkspaces = createAsyncThunk(
    'workspace/fetchUserWorkspaces',
    async (_, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            };
            const response = await axios.get(`${BACKEND_API}/workspace/user`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createWorkspace.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWorkspace.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces.push(action.payload.newWorkspace);
            })
            .addCase(createWorkspace.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserWorkspaces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserWorkspaces.fulfilled, (state, action) => {
                state.loading = false;
                state.workspaces = action.payload.workspaces;
            })
            .addCase(fetchUserWorkspaces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default workspaceSlice.reducer;
