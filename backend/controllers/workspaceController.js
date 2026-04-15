import { jsx } from "react/jsx-runtime";
import { ensureUniqueCode } from "../services/generateWorkspaceCode";
import { addMemberToWorkspace, getMemberRole } from "../Tables/workspace_members";
import { getUserWorkspaces, getWorkspaceByCode, getWorkspaceById, updateWorkspace } from "../Tables/workspaces";



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

