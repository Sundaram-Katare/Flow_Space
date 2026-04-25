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

// Document events
export const openDoc = (docId) => {
  if (socket) {
    socket.emit("open-doc", docId);
  }
};

export const closeDoc = (docId) => {
  if (socket) {
    socket.emit("close-doc", docId);
  }
};

export const docTyping = (docId, blockId, position) => {
  if (socket) {
    socket.emit("doc-typing", { docId, blockId, position });
  }
};

export const docStopTyping = (docId) => {
  if (socket) {
    socket.emit("doc-stop-typing", docId);
  }
};

export const onDocUpdated = (callback) => {
  if (socket) {
    socket.on("doc-updated", callback);
  }
};

export const onDocBlockUpdated = (callback) => {
  if (socket) {
    socket.on("doc-block-updated", callback);
  }
};

export const onDocBlockAdded = (callback) => {
  if (socket) {
    socket.on("doc-block-added", callback);
  }
};

export const onDocBlockDeleted = (callback) => {
  if (socket) {
    socket.on("doc-block-deleted", callback);
  }
};

export const onDocUserJoined = (callback) => {
  if (socket) {
    socket.on("doc-user-joined", callback);
  }
};

export const onDocUserLeft = (callback) => {
  if (socket) {
    socket.on("doc-user-left", callback);
  }
};

export const onUserDocTyping = (callback) => {
  if (socket) {
    socket.on("user-doc-typing", callback);
  }
};

export const onUserDocStopTyping = (callback) => {
  if (socket) {
    socket.on("user-doc-stop-typing", callback);
  }
};

export const onDocCreated = (callback) => {
  if (socket) {
    socket.on("doc-created", callback);
  }
};

export const onDocDeleted = (callback) => {
  if (socket) {
    socket.on("doc-deleted", callback);
  }
};