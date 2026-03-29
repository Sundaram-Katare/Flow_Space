import pool from "../../db/db.js";
import generateCodeFromName from "../../services/generateWorkspaceCode.js";

export const createWorkspace = async (req, res) => {
    try {
        const { name } = req.body;
        const owner_id = req.user.id;

        const invite_code = await generateCodeFromName(name);

        const newWorkspace = await pool.query(
            'INSERT INTO workspaces (name, owner_id, invite_code) VALUES ($1, $2, $3) RETURNING *',
            [name, owner_id, invite_code]
        );

        await pool.query(`
             INSERT INTO workspace_members (user_id, workspace_id, role)
             VALUES ($1, $2, 'admin')
          `, [owner_id, newWorkspace.rows[0].id]
        );

        return res.status(200).json({ message: "Workspace created successfully", newWorkspace: newWorkspace[0] });

    } catch (err) {
        return res.status(500).json({ message: "Error in creating workspace", err });
    }
}

export const updateWorkspaceName = async (req, res) => {
  try {
    const { name } = req.body;
    const { id: w_id } = req.params;
    const owner_id = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingWorkspace = await pool.query(
      'SELECT * FROM workspaces WHERE id = $1',
      [w_id]
    );

    if (existingWorkspace.rows.length === 0) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (existingWorkspace.rows[0].owner_id !== owner_id) {
      return res.status(403).json({ message: "Only admin can edit the name" });
    }

    const updatedWorkspace = await pool.query(
      `UPDATE workspaces
       SET name = $1
       WHERE id = $2
       RETURNING *`,
      [name, w_id]
    );

    return res.status(200).json({
      message: "Name Updated Successfully",
      workspace: updatedWorkspace.rows[0]
    });

  } catch (err) {
    return res.status(500).json({ message: "Error Updating Workspace name", error: err.message });
  }
};

export const getWorkspaceInviteCode = async (req, res) => {
    try {
      const { id: w_id } = req.params;

      const code = await pool.query(`
        SELECT invite_code FROM workspaces
        WHERE id = $1
        `, [w_id]);

        return res.status(200).json({ message: "Invite Code Fetched successfully", code: code.rows[0].invite_code });
    } catch (err) {
        return res.status(500).json({ message: "Error Getting Invite Code", err });
    }
};

export const joinWorkspace = async (req, res) => {
    try {
      const { invite_code } = req.body;
      const user_id = req.user.id;

      const workspace = await pool.query(`
        SELECT * FROM workspaces
        WHERE invite_code = $1
      `, [invite_code]);

      if (workspace.rows.length === 0) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const workspace_id = workspace.rows[0].id;
        await pool.query(`
        INSERT INTO workspace_members (user_id, workspace_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, workspace_id) DO NOTHING
      `, [user_id, workspace_id]);


      return res.status(200).json({ message: "Successfully joined workspace", workspace: workspace.rows[0] });

    } catch (err) {
        return res.status(500).json({ message: "Error Joining Workspace", err });
    }
}