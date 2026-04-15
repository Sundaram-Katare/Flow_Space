import express from 'express';
import { verifyAuth } from "../middleware/authMiddleware.js";
import { createNewWorkspace, getUserWorkspacesController, getWorkspaceController, updateWorkspaceController, deleteWorkspaceController, getWorkspaceMembersController, joinWorkspaceController, removeMemberController, leaveWorkspaceController } from '../controllers/workspaceController.js';

const router = express.Router();

router.use(verifyAuth);

router.post("/", createNewWorkspace);
router.get("/", getUserWorkspacesController);
router.get("/:workspaceId", getWorkspaceController);
router.put("/:workspaceId", updateWorkspaceController);
router.delete("/:workspaceId", deleteWorkspaceController);

router.get("/:workspaceId/members", getWorkspaceMembersController);
router.post("/join", joinWorkspaceController);
router.delete("/:workspaceId/members/:memberId", removeMemberController);
router.post("/:workspaceId/leave", leaveWorkspaceController);

export default router;