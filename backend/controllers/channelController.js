import {
  createChannel,
  getChannelsByWorkspace,
  getChannelById,
  deleteChannel,
} from "../Tables/channels.js";
import {
  getMemberRole,
} from "../Tables/workspace_members.js";
import * as cache from "../services/cache.js";

export const createChannelController = async (req, res) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;
    const { name, description, channelType } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Channel name required" });
    }

    // const role = await getMemberRole(workspaceId, userId);
    // if (role !== "admin") {
    //   return res.status(403).json({ error: "Only admins can create channels" });
    // }

    const channel = await createChannel(
      workspaceId,
      name,
      description || "",
      channelType || "public"
    );

    await cache.del(`channels:${workspaceId}`);

    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });
  } catch (err) {
    console.error("Create channel error:", err);
    res.status(500).json({ error: "Failed to create channel" });
  }
};

export const getWorkspaceChannelsController = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const cacheKey = `channels:${workspaceId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ channels: cached });
    }

    const channels = await getChannelsByWorkspace(workspaceId);

    await cache.set(cacheKey, channels, 3600);

    res.json({ channels });
  } catch (err) {
    console.error("Get channels error:", err);
    res.status(500).json({ error: "Failed to get channels" });
  }
};

export const getChannelController = async (req, res) => {
  try {
    const { channelId } = req.params;

    const channel = await getChannelById(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const { getChannelMessages } = await import("../Tables/messages.js");
    const messages = await getChannelMessages(channelId, 50, 0);

    res.json({
      channel,
      messages,
    });
  } catch (err) {
    console.error("Get channel error:", err);
    res.status(500).json({ error: "Failed to get channel" });
  }
};

export const deleteChannelController = async (req, res) => {
  try {
    const { channelId, workspaceId } = req.params;
    const userId = req.userId;

    const role = await getMemberRole(workspaceId, userId);
    if (role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete channels" });
    }

    await deleteChannel(channelId);

    await cache.del(`channels:${workspaceId}`);

    res.json({ message: "Channel deleted successfully" });
  } catch (err) {
    console.error("Delete channel error:", err);
    res.status(500).json({ error: "Failed to delete channel" });
  }
};