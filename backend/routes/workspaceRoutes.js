const express = require('express');
const { verifyAuth } = require("../middleware/authMiddleware");
const { createNewWorkspace, getUserWorkspacesController, getWorkspaceController, updateWorkspaceController, deleteWorkspaceController, getWorkspaceMembersController, joinWorkspaceController, removeMemberController, leaveWorkspaceController } = require('../controllers/workspaceController');

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
