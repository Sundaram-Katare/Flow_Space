import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import workspaceReducer from '../features/workspace/workspaceSlice.js';
import chatReducer from '../features/chat/chatSlice.js';
import taskReducer from '../features/task/taskSlice.js';
import docReducer from '../features/docs/docSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        workspace: workspaceReducer,
        chat: chatReducer,
        tasks: taskReducer,
        docs: docReducer,
    },
});

export default store;