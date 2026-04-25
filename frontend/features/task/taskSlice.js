import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  tasksByStatus: {
    todo: [],
    in_progress: [],
    done: [],
  },
  isLoading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.tasksByStatus = {
        todo: action.payload.filter((t) => t.status === "todo"),
        in_progress: action.payload.filter((t) => t.status === "in_progress"),
        done: action.payload.filter((t) => t.status === "done"),
      };
    },

    addTask: (state, action) => {
      state.tasks.push(action.payload);
      const status = action.payload.status || "todo";
      state.tasksByStatus[status].push(action.payload);
    },

    updateTask: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        const oldStatus = state.tasks[index].status;
        state.tasks[index] = action.payload;

        if (oldStatus !== action.payload.status) {
          state.tasksByStatus[oldStatus] = state.tasksByStatus[oldStatus].filter(
            (t) => t.id !== action.payload.id
          );
          state.tasksByStatus[action.payload.status].push(action.payload);
        }
      }
    },

    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        const oldStatus = task.status;
        task.status = status;

        state.tasksByStatus[oldStatus] = state.tasksByStatus[oldStatus].filter(
          (t) => t.id !== taskId
        );
        state.tasksByStatus[status].push(task);
      }
    },

    deleteTask: (state, action) => {
      const taskId = action.payload;
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        state.tasks = state.tasks.filter((t) => t.id !== taskId);
        state.tasksByStatus[task.status] = state.tasksByStatus[task.status].filter(
          (t) => t.id !== taskId
        );
      }
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearTasks: (state) => {
      state.tasks = [];
      state.tasksByStatus = {
        todo: [],
        in_progress: [],
        done: [],
      };
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  setIsLoading,
  setError,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;