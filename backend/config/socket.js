import { Server } from 'socket.io';
import { verifyToken } from '../services/jwt.js';
import { getUserById } from '../services/user.js';
import redisClient from './redis.js';

const userSockets = {};
const socketUsers = {};

export const initializeSocket = (server, app) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || ""
        }
    })
}