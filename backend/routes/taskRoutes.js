import express from "express";
import { verifyAuth } from "../middleware/authMiddleware.js";
import {
  createTaskController,
  getWorkspaceTasksController,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController,
  getTasksByStatusController,
  getMyTasksController,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(verifyAuth);

router.post("/workspace/:workspaceId", createTaskController);

router.get("/workspace/:workspaceId", getWorkspaceTasksController);

router.get("/workspace/:workspaceId/assigned-to-me", getMyTasksController);

router.get("/workspace/:workspaceId/status/:status", getTasksByStatusController);

router.put("/:taskId/workspace/:workspaceId", updateTaskController);

router.patch("/:taskId/status/workspace/:workspaceId", updateTaskStatusController);

router.delete("/:taskId/workspace/:workspaceId", deleteTaskController);

export default router;