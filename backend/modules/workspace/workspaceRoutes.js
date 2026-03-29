import express from 'express';
import { createWorkspace, getWorkspaceInviteCode, joinWorkspace, updateWorkspaceName } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.patch("/name/:id", authMiddleware, updateWorkspaceName);
router.get("/:id", authMiddleware, getWorkspaceInviteCode);
router.post("/join", authMiddleware, joinWorkspace);

export default router;