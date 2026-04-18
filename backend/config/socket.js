import { Server } from "socket.io";
import { verifyToken } from "../services/jwt.js";
import { getUserById } from "../Tables/users.js";
import redisClient from "./redis.js";

// Store active socket connections
const userSockets = {}; // { userId: [socket1, socket2, ...] }
const socketUsers = {};  // { socketId: userId }

export const initializeSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // ==================== AUTHENTICATION MIDDLEWARE ====================
  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      // Verify JWT token
      const decoded = verifyToken(token);
      const user = await getUserById(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user to socket
      socket.userId = user.id;
      socket.username = user.username;
      socket.email = user.email;

      next();
    } catch (err) {
      next(new Error(err.message));
    }
  });

  // ==================== CONNECTION HANDLERS ====================

  io.on("connection", (socket) => {
    console.log(`✅ User ${socket.username} connected: ${socket.id}`);

    // Track socket connection
    if (!userSockets[socket.userId]) {
      userSockets[socket.userId] = [];
    }
    userSockets[socket.userId].push(socket);
    socketUsers[socket.id] = socket.userId;

    // ==================== CHANNEL EVENTS ====================

    // User joins channel
    socket.on("join-channel", async (channelId) => {
      try {
        const room = `channel:${channelId}`;
        socket.join(room);
        console.log(`👤 ${socket.username} joined channel ${channelId}`);

        // Notify others that user joined
        socket.to(room).emit("user-joined", {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      } catch (err) {
        console.error("Join channel error:", err);
        socket.emit("error", { message: "Failed to join channel" });
      }
    });

    // User leaves channel
    socket.on("leave-channel", (channelId) => {
      try {
        const room = `channel:${channelId}`;
        socket.leave(room);
        console.log(`👋 ${socket.username} left channel ${channelId}`);

        // Notify others
        io.to(room).emit("user-left", {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      } catch (err) {
        console.error("Leave channel error:", err);
      }
    });

    // User sends message
    socket.on("send-message", async (data) => {
      try {
        const { channelId, content } = data;

        if (!content.trim()) {
          return socket.emit("error", { message: "Message cannot be empty" });
        }

        // Save message to database
        const { createMessage } = await import("../Tables/messages.js");
        const message = await createMessage(channelId, socket.userId, content);

        // Prepare message with user info
        const messageData = {
          id: message.id,
          channelId,
          userId: socket.userId,
          username: socket.username,
          content: message.content,
          created_at: message.created_at,
        };

        await redisClient.publish(
          `channel:${channelId}`,
          JSON.stringify(messageData)
        );

        const room = `channel:${channelId}`;
        io.to(room).emit("message-received", messageData);

        console.log(`💬 Message in channel ${channelId}: ${content.substring(0, 30)}...`);
      } catch (err) {
        console.error("Send message error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });


    socket.on("typing", (data) => {
      try {
        const { channelId } = data;
        const room = `channel:${channelId}`;

        // Broadcast "user is typing" to others
        socket.to(room).emit("user-typing", {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      } catch (err) {
        console.error("Typing error:", err);
      }
    });

    socket.on("stop-typing", (data) => {
      try {
        const { channelId } = data;
        const room = `channel:${channelId}`;

        socket.to(room).emit("user-stop-typing", {
          userId: socket.userId,
          channelId,
        });
      } catch (err) {
        console.error("Stop typing error:", err);
      }
    });

    // ==================== WORKSPACE PRESENCE ====================

    socket.on("workspace-active", (workspaceId) => {
      try {
        const room = `workspace:${workspaceId}`;
        socket.join(room);
        console.log(`🟢 ${socket.username} active in workspace ${workspaceId}`);

        // Notify others that user is online
        io.to(room).emit("user-online", {
          userId: socket.userId,
          username: socket.username,
        });
      } catch (err) {
        console.error("Workspace active error:", err);
      }
    });

    // ==================== DISCONNECT ====================

    socket.on("disconnect", () => {
      try {
        console.log(`❌ User ${socket.username} disconnected: ${socket.id}`);

        // Remove socket from tracking
        if (userSockets[socket.userId]) {
          userSockets[socket.userId] = userSockets[socket.userId].filter(
            (s) => s.id !== socket.id
          );
          if (userSockets[socket.userId].length === 0) {
            delete userSockets[socket.userId];
          }
        }
        delete socketUsers[socket.id];

        // Notify all that user is offline
        socket.broadcast.emit("user-offline", {
          userId: socket.userId,
          username: socket.username,
        });
      } catch (err) {
        console.error("Disconnect error:", err);
      }
    });

    // ==================== ERROR HANDLING ====================

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  // Store io instance for access in controllers
  app.set("io", io);

  return io;
};

export { userSockets, socketUsers };