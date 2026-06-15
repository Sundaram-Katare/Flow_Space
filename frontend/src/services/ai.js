import api from "./api.js";

/**
 * Request the backend to generate a task description using the Gemini API based on a title.
 * @param {string} title 
 * @returns {Promise<string>}
 */
export const generateTaskDescriptionAPI = async (title) => {
  const response = await api.post("/ai/generate-description", { title });
  return response.data.description;
};
