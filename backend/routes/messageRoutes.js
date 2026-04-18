import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
  getMessagesController,
  updateMessageController,
  deleteMessageController,
} from "../controllers/messageController.js";

const router = express.Router();

router.use(verifyAuth);

router.get("/channel/:channelId", getMessagesController);

router.put("/:messageId", updateMessageController);

router.delete("/:messageId", deleteMessageController);

export default router;