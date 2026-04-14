import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export function connectSocket(token) {
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from socket server');
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
}