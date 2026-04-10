import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import workspaceReducer from '../features/workspace/workspaceSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
    },
});

export default store;