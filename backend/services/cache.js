const redisClient = require('../config/redis');

async function set(key, value, expirySeconds = 3600) {
    try {
      await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
    } catch (error) {
        console.error("Cache Set Error: ", error);
    }
}

async function get(key) {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

async function del(key) {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}

async function clear() {
  try {
    await redisClient.flushDb();
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

module.exports = {
    set,
    get,
    del,
    clear,
};