const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const env = require('./config/env');
const logger = require('./utils/logger');

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


app.use((req, res) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

//Health Check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
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

module.exports = { app, server, io };