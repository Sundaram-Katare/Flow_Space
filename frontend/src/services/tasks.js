import api from "./api.js";

// Create task
export const createTask = async (workspaceId, title, description, priority = "medium", assignedTo = null) => {
  const response = await api.post(`/tasks/workspace/${workspaceId}`, {
    title,
    description,
    priority,
    assignedTo,
  });
  return response.data;
};

// Get all tasks in workspace
export const getWorkspaceTasks = async (workspaceId) => {
  const response = await api.get(`/tasks/workspace/${workspaceId}`);
  return response.data;
};

// Get tasks assigned to me
export const getMyTasks = async (workspaceId) => {
  const response = await api.get(`/tasks/workspace/${workspaceId}/assigned-to-me`);
  return response.data;
};

// Get tasks by status
export const getTasksByStatus = async (workspaceId, status) => {
  const response = await api.get(`/tasks/workspace/${workspaceId}/status/${status}`);
  return response.data;
};

// Update task
export const updateTask = async (taskId, workspaceId, updates) => {
  const response = await api.put(`/tasks/${taskId}/workspace/${workspaceId}`, updates);
  return response.data;
};

// Update task status (for drag-and-drop)
export const updateTaskStatus = async (taskId, workspaceId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status/workspace/${workspaceId}`, { status });
  return response.data;
};

// Delete task
export const deleteTask = async (taskId, workspaceId) => {
  const response = await api.delete(`/tasks/${taskId}/workspace/${workspaceId}`);
  return response.data;
};