import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
  createChannelController,
  getWorkspaceChannelsController,
  getChannelController,
  deleteChannelController,
} from "../controllers/channelController.js";

const router = express.Router();

router.use(verifyAuth);

router.post("/:workspaceId", createChannelController);

router.get("/workspace/:workspaceId", getWorkspaceChannelsController);

router.get("/:channelId", getChannelController);

router.delete("/:channelId/workspace/:workspaceId", deleteChannelController);

export default router;