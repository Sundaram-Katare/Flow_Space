import api from './api.js';

export const createWorkspace = async (name, description) => {
    const response = await api.post("/workspaces", {
        name,
        description,
    });

    return response.data;
};

export const getUserWorkspaces = async () => {
    const response = await api.get("/workspaces");
    return response.data;
};

export const getWorkspace = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
};

export const updateWorkspace = async (workspaceId, name, description) => {
    const response = await api.put(`/workspaces/${workspaceId}`, {
        name,
        description,
    });
    return response.data;
};

export const deleteWorkspace = async (workspaceId) => {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
};

export const getWorkspaceMembers = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
};

export const joinWorkspace = async (workspaceCode) => {
    const response = await api.post("/workspaces/join", {
        workspace_code: workspaceCode,
    });
    return response.data;
};

export const removeMember = async (workspaceId, memberId) => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
};

export const leaveWorkspace = async (workspaceId) => {
    const response = await api.post(`/workspaces/${workspaceId}/leave`);
    return response.data;
};

