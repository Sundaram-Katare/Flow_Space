import express from 'express';
import { createWorkspace, getWorkspaceInviteCode, updateWorkspaceName } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.patch("/name/:id", authMiddleware, updateWorkspaceName);
router.get("/:id", authMiddleware, getWorkspaceInviteCode);

export default router;