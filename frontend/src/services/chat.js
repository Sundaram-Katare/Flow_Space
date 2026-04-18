import api from "./api.js";

export const createChannel = async (workspaceId, name, description, channelType = "public") => {
  const response = await api.post(`/channels/${workspaceId}`, {
    name,
    description,
    channelType,
  });
  return response.data;
};

export const getWorkspaceChannels = async (workspaceId) => {
  const response = await api.get(`/channels/workspace/${workspaceId}`);
  return response.data;
};

export const getChannel = async (channelId) => {
  const response = await api.get(`/channels/${channelId}`);
  return response.data;
};

export const getMessages = async (channelId, limit = 50, offset = 0) => {
  const response = await api.get(`/messages/channel/${channelId}`, {
    params: { limit, offset },
  });
  return response.data;
};

export const deleteChannel = async (channelId, workspaceId) => {
  const response = await api.delete(`/channels/${channelId}/workspace/${workspaceId}`);
  return response.data;
};

export const updateMessage = async (messageId, content) => {
  const response = await api.put(`/messages/${messageId}`, { content });
  return response.data;
};

export const deleteMessageAPI = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};