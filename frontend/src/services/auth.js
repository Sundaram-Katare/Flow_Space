import api from "./api.js";

export const signup = async (email, username, password, firstName, lastName) => {
    const response = await api.post("/auth/signup", {
        email,
        username,
        password,
        firstName,
        lastName
    });

    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password
    });
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const verifyTokenAPI = async (token) => {
  const response = await api.post("/auth/verify-token", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};