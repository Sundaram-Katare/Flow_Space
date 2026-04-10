import express from 'express';
import { createWorkspace, getAllMemebersOfWorkspace, getUserWorkspaces, getWorkspaceInviteCode, joinWorkspace, updateWorkspaceName } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.get("/user", authMiddleware, getUserWorkspaces);
router.patch("/name/:id", authMiddleware, updateWorkspaceName);
router.get("/:id", authMiddleware, getWorkspaceInviteCode);
router.post("/join", authMiddleware, joinWorkspace);
router.get("/members/:id", authMiddleware, getAllMemebersOfWorkspace);

export default router;