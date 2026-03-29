import express from 'express';
import { createWorkspace, getAllMemebersOfWorkspace, getWorkspaceInviteCode, joinWorkspace, updateWorkspaceName } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.patch("/name/:id", authMiddleware, updateWorkspaceName);
router.get("/:id", authMiddleware, getWorkspaceInviteCode);
router.post("/join", authMiddleware, joinWorkspace);
router.get("/members", authMiddleware, getAllMemebersOfWorkspace);

export default router;