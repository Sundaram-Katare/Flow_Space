import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export function connectSocket(token) {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from socket server');
  });

  socket.on("error", (error) => {
    console.error("❌ Socket error:", error);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
  }
};

export const joinChannel = (channelId) => {
  if(socket) {
    socket.emit("join-channel", channelId);
  }
};

export const leaveChannel = (channelId) => {
  if (socket) {
    socket.emit("leave-channel", channelId);
  }
};

export const sendMessage = (channelId, content) => {
  if (socket) {
    socket.emit("send-message", { channelId, content });
  }
};

export const sendTyping = (channelId) => {
  if (socket) {
    socket.emit("typing", { channelId });
  }
};

export const sendStopTyping = (channelId) => {
  if (socket) {
    socket.emit("stop-typing", { channelId });
  }
};

export const setWorkspaceActive = (workspaceId) => {
  if (socket) {
    socket.emit("workspace-active", workspaceId);
  }
};

export const onMessageReceived = (callback) => {
  if (socket) {
    socket.on("message-received", callback);
  }
};

export const onUserJoined = (callback) => {
  if (socket) {
    socket.on("user-joined", callback);
  }
};

export const onUserLeft = (callback) => {
  if (socket) {
    socket.on("user-left", callback);
  }
};

export const onUserTyping = (callback) => {
  if (socket) {
    socket.on("user-typing", callback);
  }
};

export const onUserStopTyping = (callback) => {
  if (socket) {
    socket.on("user-stop-typing", callback);
  }
};

export const onUserOnline = (callback) => {
  if (socket) {
    socket.on("user-online", callback);
  }
};

export const onUserOffline = (callback) => {
  if (socket) {
    socket.on("user-offline", callback);
  }
};

export const removeEventListener = (event) => {
  if (socket) {
    socket.off(event);
  }
};