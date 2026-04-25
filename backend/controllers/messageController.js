import {
  getChannelMessages,
  updateMessage,
  deleteMessage,
} from "../Tables/messages.js";
// import { cache } from "../services/cache.js";

export const getMessagesController = async (req, res) => {
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const messages = await getChannelMessages(channelId, limit, offset);

    res.json({
      messages,
      limit,
      offset,
    });
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const updateMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content required" });
    }
    const { getMessageById } = await import("../Tables/messages.js");
    const message = await getMessageById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.user_id !== userId) {
      return res.status(403).json({ error: "Can only edit own messages" });
    }

    const updated = await updateMessage(messageId, content);

    res.json({
      message: "Message updated",
      data: updated,
    });
  } catch (err) {
    console.error("Update message error:", err);
    res.status(500).json({ error: "Failed to update message" });
  }
};

export const deleteMessageController = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const { getMessageById } = await import("../Tables/messages.js");
    const message = await getMessageById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.user_id !== userId) {
      return res.status(403).json({ error: "Can only delete own messages" });
    }

    await deleteMessage(messageId);

    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error("Delete message error:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};