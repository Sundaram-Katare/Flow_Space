import api from "./api.js";

export const createDoc = async (workspaceId, title) => {
  const response = await api.post(`/docs/workspace/${workspaceId}`, {
    title,
  });
  return response.data;
};

export const getWorkspaceDocs = async (workspaceId) => {
  const response = await api.get(`/docs/workspace/${workspaceId}`);
  return response.data;
};

export const getDoc = async (docId) => {
  const response = await api.get(`/docs/${docId}`);
  return response.data;
};

export const updateDoc = async (docId, workspaceId, title, content) => {
  const response = await api.put(`/docs/${docId}/workspace/${workspaceId}`, {
    title,
    content,
  });
  return response.data;
};

export const updateDocBlock = async (docId, workspaceId, blockId, blockData) => {
  const response = await api.patch(`/docs/${docId}/block/workspace/${workspaceId}`, {
    blockId,
    blockData,
  });
  return response.data;
};

export const addDocBlock = async (docId, workspaceId, blockType, afterBlockId) => {
  const response = await api.post(`/docs/${docId}/block/workspace/${workspaceId}`, {
    blockType,
    afterBlockId,
  });
  return response.data;
};

export const deleteDocBlock = async (docId, workspaceId, blockId) => {
  const response = await api.delete(
    `/docs/${docId}/block/${blockId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const deleteDocAPI = async (docId, workspaceId) => {
  const response = await api.delete(`/docs/${docId}/workspace/${workspaceId}`);
  return response.data;
};