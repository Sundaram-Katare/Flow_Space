import express from 'express';
import { createWorkspace } from './workspaceController.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post("/create", authMiddleware, createWorkspace);

export default router;