import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import env from './config/env.js';
import logger from './utils/logger.js';
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import { initializeTables } from './db/init.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: env.frontend_url,
        methods: ['GET', 'POST'], 
    },
});

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

//Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);
  
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