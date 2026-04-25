import { Server } from "socket.io";
import { verifyToken } from "../services/jwt.js";
import { getUserById } from "../Tables/users.js";
import redisClient from "./redis.js";

const userSockets = {}; 
const socketUsers = {}; 

export const initializeSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = verifyToken(token);
      const user = await getUserById(decoded.userId);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user.id;
      socket.username = user.username;
      socket.email = user.email;

      next();
    } catch (err) {
      next(new Error(err.message));
    }
  });


  io.on("connection", (socket) => {
    console.log(`✅ User ${socket.username} connected: ${socket.id}`);

    if (!userSockets[socket.userId]) {
      userSockets[socket.userId] = [];
    }
    userSockets[socket.userId].push(socket);
    socketUsers[socket.id] = socket.userId;


    socket.on("join-channel", async (channelId) => {
      try {
        const room = `channel:${channelId}`;
        socket.join(room);
        console.log(`👤 ${socket.username} joined channel ${channelId}`);

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

    socket.on("leave-channel", (channelId) => {
      try {
        const room = `channel:${channelId}`;
        socket.leave(room);
        console.log(`👋 ${socket.username} left channel ${channelId}`);

        io.to(room).emit("user-left", {
          userId: socket.userId,
          username: socket.username,
          channelId,
        });
      } catch (err) {
        console.error("Leave channel error:", err);
      }
    });

    socket.on("send-message", async (data) => {
      try {
        const { channelId, content } = data;

        if (!content.trim()) {
          return socket.emit("error", { message: "Message cannot be empty" });
        }

        const { createMessage } = await import("../Tables/messages.js");
        const message = await createMessage(channelId, socket.userId, content);

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


    socket.on("workspace-active", (workspaceId) => {
      try {
        const room = `workspace:${workspaceId}`;
        socket.join(room);
        console.log(`🟢 ${socket.username} active in workspace ${workspaceId}`);

        io.to(room).emit("user-online", {
          userId: socket.userId,
          username: socket.username,
        });
      } catch (err) {
        console.error("Workspace active error:", err);
      }
    });


    socket.on("disconnect", () => {
      try {
        console.log(`❌ User ${socket.username} disconnected: ${socket.id}`);

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


    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
  });

  app.set("io", io);

  return io;
};

export { userSockets, socketUsers };