import express from 'express';
import { createWorkspace } from './workspaceController.js';

const router = express.Router();

router.post("/create", createWorkspace);

export default router;