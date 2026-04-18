import redisClient from "../config/redis.js";

const subscriberClient = redisClient.duplicate();

export const initializeRedisSubscriber = async (io) => {
  try {
    await subscriberClient.connect();
    console.log("✅ Redis Subscriber connected");

    await subscriberClient.pSubscribe("channel:*", (message, channel) => {
      try {
        const messageData = JSON.parse(message);

        const channelId = channel.split(":")[1];

        const room = `channel:${channelId}`;
        io.to(room).emit("message-received", messageData);

        console.log(
          `📡 Redis message distributed to channel ${channelId}`
        );
      } catch (err) {
        console.error("Redis subscriber error:", err);
      }
    });

    await subscriberClient.pSubscribe("workspace:*", (message, channel) => {
      try {
        const data = JSON.parse(message);
        const workspaceId = channel.split(":")[1];

        io.to(channel).emit("workspace-update", data);
      } catch (err) {
        console.error("Workspace subscription error:", err);
      }
    });

  } catch (err) {
    console.error("Redis subscriber initialization failed:", err);
    throw err;
  }
};

export default subscriberClient;