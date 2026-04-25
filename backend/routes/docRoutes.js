import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
  createDocController,
  getWorkspaceDocsController,
  getDocController,
  updateDocController,
  updateDocBlockController,
  addBlockController,
  deleteBlockController,
  deleteDocController,
} from "../controllers/docsController.js";

const router = express.Router();

router.use(verifyAuth);

router.post("/workspace/:workspaceId", createDocController);

router.get("/workspace/:workspaceId", getWorkspaceDocsController);

router.get("/:docId", getDocController);

router.put("/:docId/workspace/:workspaceId", updateDocController);

router.patch("/:docId/block/workspace/:workspaceId", updateDocBlockController);

router.post("/:docId/block/workspace/:workspaceId", addBlockController);

router.delete("/:docId/block/:blockId/workspace/:workspaceId", deleteBlockController);

router.delete("/:docId/workspace/:workspaceId", deleteDocController);

export default router;