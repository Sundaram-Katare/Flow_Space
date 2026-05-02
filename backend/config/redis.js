import redis from 'redis';
import { env } from './env.js';

console.log('Redis URL:', env.redis.url ? 'Set' : 'Not set - using default');

const redisClient = redis.createClient({
    url: env.redis.url,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.log('Redis max retries exceeded');
                return new Error('Redis max retries exceeded');
            }
            return retries * 50;
        },
        connectTimeout: 10000,
    },
});

redisClient.on('connect', () => {
    console.log("✅ Redis Connected");
});

redisClient.on('error', (err) => {
    console.error('❌ Redis Error: ', err.message);
});

redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Reconnecting...');
});

redisClient.connect().catch((err) => {
    console.error("❌ Redis Connection Failed: ", err.message);
});

export default redisClient;