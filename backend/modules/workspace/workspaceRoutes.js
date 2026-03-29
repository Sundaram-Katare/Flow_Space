import express from 'express';
import { createWorkspace, updateWorkspaceName } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);
router.patch("/name/:id", authMiddleware, updateWorkspaceName);

export default router;