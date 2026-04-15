import { jsx } from "react/jsx-runtime";
import { ensureUniqueCode } from "../services/generateWorkspaceCode";
import { addMemberToWorkspace, getMemberRole, getWorkspaceMembers, removeMemberFromWorkspace } from "../Tables/workspace_members";
import { deleteWorkspace, getUserWorkspaces, getWorkspaceByCode, getWorkspaceById, updateWorkspace } from "../Tables/workspaces";



export const createWorkspace = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Workspace Name Required" });
        }

        const code = await ensureUniqueCode(getWorkspaceByCode);

        const workspace = await createWorkspace(userId, name, description || "", code);

        await addMemberToWorkspace(workspace.id, userId, "admin");

        await cache.set(`workspace:${workspace.id}`, workspace, 3600);

        res.status(201).json({
            message: "Workspace Created Successfully",
            workspace: {
                id: workspace.id,
                name: workspace.name,
                description: workspace.description,
                workspace_code: workspace.workspace_code,
                created_at: workspace.created_at,
            },
        });
    } catch (err) {
        console.error("Create Workspace Error: ", err);
        return res.status(500).json({ error: "failed to create workspace" });
    }
};

export const getUserWorkspacesController = async (req, res) => {
    try {
        const userId = req.userId;

        const cacheKey = `user_workspaces:${userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.json({ workspace: cached });
        }

        const workspaces = await getUserWorkspaces(userId);

        await cache.set(cacheKey, workspaces, 3600);

        res.json({ workspaces });
    } catch (err) {
        console.error("Error Geting all workspaces of a user: ", err);
        return res.status(500).json({ error: "Error Getting Workspaces " });
    }
};

// Get Single Workspace with members
export const getWorkspaceController = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const userId = req.userId;

        const cached = await cache.get(`workspace:${workspaceId}`);
        if (cached) {
            return res.json({ workspace: cached });
        }

        const workspace = await getWorkspaceById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ error: "Workspace not found with this code" });
        }

        await cache.set(`workspace:${workspaceId}`, workspace, 3600);

        return req.status(200).json({ workspace });
    } catch (err) {
        console.error("Error Getting a workspace: ", err);
        return res.status(500), json({ error: "Error Getting a workspace" });
    }
};

export const updateWorkspaceController = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.userId;
        const { workspaceId } = req.params;

        const role = await getMemberRole(workspaceId, userId);

        if (role !== 'admin') {
            return res.status(403).json({ error: "Only Admin can edit these details" });
        }

        const workspace = await updateWorkspace(workspaceId, name, description);

        await cache.del(`workspace:${workspaceId}`);
        await cache.del(`user_workspaces:${userId}`);

        res.json({
            message: "Workspace updated successfully",
            workspace,
        });
    } catch (err) {
        console.error("Error Updating Workspace: ", err);
        return res.status(500).json({ error: "Error Updating Workspace" });
    }
};

export const deleteWorkspaceController = async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;

        const workspace = await getWorkspaceById(workspaceId);
        if (workspace.user_id !== userId) {
            return res.status(403).json({ error: "Only Owner can delete the workspace" });
        }

        await deleteWorkspace(workspaceId);

        await cache.del(`workspace:${workspaceId}`);
        await cache.del(`user_workspaces:${userId}`);

        res.json({ message: "Workspace deleted successfully" });
    } catch (err) {
        console.error("Error Delrting the workspace: ", err);
        return res.status(500).json({ error: "Error Delting the workspace " });
    }
};

export const getWorkspaceMembersController = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const cacheKey = `workspace_members:${workspaceId}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return res.status(200).json({ members: cached });
        }

        const members = await getWorkspaceMembers(workspaceId);

        await cache.set(cacheKey, members, 1800);

        res.status(200).json({ members });
    } catch (err) {
        console.error("Error Getting Workspace Mmebers: ", err);
        return res.status(500).json({ error: "Error Gettign Workspace Members" });
    }
};

//Join Workspace via code
export const joinWorkspaceController = async (req, res) => {
    try {
        const userId = req.userId;
        const { workspace_code } = req.body;

        if (!workspace_code) {
            return res.status(400).json({ Error: "Workspace_code is required" });
        }

        const workspace = await getWorkspaceByCode(workspace_code);

        if (!workspace) {
            return res.status(400).json({ error: "Invalid Workspace" });
        }

        const existingMember = await getMemberRole(workspace.id, userId);
        if (existingMember) {
            return res.status(409).json({ error: "Already a member of this workspace" });
        }

        await addMemberToWorkspace(workspace.id, userId, "member");

        await cache.del(`user_workspaces:${userId}`);
        await cache.del(`workspace_members:${workspace.id}`);

        res.status(201).json({
            message: "Joined workspace successfully",
            workspace: {
                id: workspace.id,
                name: workspace.name,
            },
        });
    } catch (err) {
        console.error("Error Joining Workspace: ", err);
        return res.status(500).json({ error: "Error Joining workspace " });
    }
};

export const removeMemberController = async (req, res) => {
    try {
        const userId = req.userId;
        const { workspaceId, memberId } = req.params;

        const requesterRole = await getMemberRole(workspaceId, userId);
        if (requesterRole !== 'admin') {
            return res.status(403).json({ error: "Only admin can remove a member from the workspace" });
        }

        const targetRole = await getMemberRole(workspaceId, memberId);
        if (targetRole === "admin" && memberId !== userId) {
            return res.status(403).json({ error: "Cannot remove other admins" });
        }

        await removeMemberFromWorkspace(workspaceId, memberId);

        return res.status(200).json({ message: "Member Removed Successfully" });
    } catch (err) {
        console.error("Error Removing Member: ", err);
        return res.status(500).json({ error: "Error Removing member from the workspace" });
    }
};

// Regenerate the Invite code

//Leave Workspace
export const leaveWorkspaceController = async (res, res) => {
    try {
        const userId = req.userId;
        const { workspaceId } = req.params;

        const workspace = await getWorkspaceById(workspaceId);

        if (workspace.user_id == userId) {
            return res.status(403).json({
                error: "Workspace owner cannot leave. Delete the workspace or transfer ownership.",
            });
        }

        await removeMemberFromWorkspace(workspaceId, userId);
        // Invalidate caches
        await cache.del(`user_workspaces:${userId}`);
        await cache.del(`workspace_members:${workspaceId}`);

        res.status(200).json({ message: "Left workspace successfully" });
    } catch (err) {
        console.error("Error Leaving Workspace: ", err);
        return res.status(500).json({ error: "Error Leaving the workspace" });
    }
};