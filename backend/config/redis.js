const redis = require('redis');
const env = require('./env');

const redisClient = redis.createClient({
    host: env.redis.host,
    port: env.redis.port,
});

redisClient.on('connect', () => {
    console.log("Redis Connected");
});

redisClient.on('error', (err) => {
    console.error('Redis Error: ', err);
});

redisClient.connect().catch((err) => {
    console.error("Redis Connection Failed: ", err);
});

module.exports = redisClient;