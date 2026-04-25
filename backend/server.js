import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import env from './config/env.js';
import logger from './utils/logger.js';
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import channelRoutes from './routes/channelRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import docRoutes from './routes/docRoutes.js';
import { initializeSocket } from './config/socket.js';
import { initializeRedisSubscriber } from './services/redisSubscriber.js';
import { initializeTables } from './db/init.js';

const app = express();
const server = http.createServer(app);

const io = initializeSocket(server, app);

app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  // Initialize database tables on first request
  if (!global.dbInitialized) {
    try {
      await initializeTables();
      global.dbInitialized = true;
    } catch (err) {
      console.error("Database initialization error:", err);
    }
  }
  next();
});

initializeRedisSubscriber(io).catch((err) => {
  console.error("Failed to initialize  Redis Subscriber: ", err);
})

//Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/docs", docRoutes);

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

import { verifyToken } from './services/jwt.js';
import { createMessage } from './Tables/messages.js';
import { getUserById } from './Tables/users.js';

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  try {
    const decoded = verifyToken(token);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Authentication error: Invalid token'));
  }
});

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id} (User ID: ${socket.userId})`);

  socket.on('join-channel', (channelId) => {
    socket.join(`channel:${channelId}`);
    logger.info(`User ${socket.userId} joined channel: ${channelId}`);
  });

  socket.on('leave-channel', (channelId) => {
    socket.leave(`channel:${channelId}`);
    logger.info(`User ${socket.userId} left channel: ${channelId}`);
  });

  socket.on('send-message', async ({ channelId, content }) => {
    try {
      const user = await getUserById(socket.userId);
      const message = await createMessage(channelId, socket.userId, content);
      
      const messageData = {
        ...message,
        username: user.username,
        profile_picture: user.profile_picture
      };

      io.to(`channel:${channelId}`).emit('message-received', messageData);
    } catch (err) {
      logger.error('Error sending message:', err);
    }
  });

  socket.on('typing', ({ channelId }) => {
    getUserById(socket.userId).then(user => {
      socket.to(`channel:${channelId}`).emit('user-typing', {
        userId: socket.userId,
        username: user.username,
        channelId
      });
    });
  });

  socket.on('stop-typing', ({ channelId }) => {
    socket.to(`channel:${channelId}`).emit('user-stop-typing', {
      userId: socket.userId,
      channelId
    });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

app.set('io', io);

server.listen(env.port, () => {
  logger.info(`🚀 Server running on http://localhost:${env.port}`);
  logger.info(`📡 Socket.io available for real-time updates`);
});

export { app, server, io };