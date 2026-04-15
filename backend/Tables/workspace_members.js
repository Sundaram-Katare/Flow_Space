import pool from "../db/db.js";

export const createWorkspaceMembersTable = async () => {
    try {
        await pool.query(`
           CREATE TABLE IF NOT EXISTS workspace_members (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(workspace_id, user_id)
      );
        `);

        console.log("Workspace_Members Table created successfully");
    } catch (err) {
        console.log("Error Creating Workspace Members table: ", err);
    }
};

export const addMemberToWorkspace = async (workspaceId, userId, role = 'member' ) => {
    try {
        const result = await pool.query(
            `
             INSERT INTO workspace_members (workspace_id, user_id, role)
             VALUES ($1, $2, $3)
             RETURNING *
            `
            [workspaceId, userId, role]
        );

        return result.rows[0];
    } catch (err) {
        console.log("Error Adding member in a workspace: ", err);
    }
};

export const getWorkspaceMembers = async (workspaceId) => {
    try {
      const result = await pool.query(
        `
         SELECT u.id, u.username, u.email, u.avatar, wm.role, wm.joined_at
         FROM workspace_members wm
         JOIN users u ON wm.user_id = u.id
         WHERE wm.workspace_id = $1
         ORDER BY wm.joined_at DESC
        `, [workspaceId]
      );
      return result.rows;
    } catch (err) {
        console.log("Error Fetching all member of a workspace: ", err);
        throw err;
    }
};

export const removeMemberFromWorkspace = async (workspaceId, userId) => {
    try {
      await pool.query(
        `
         DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2
        `,
        [workspaceId, userId]
      );

      console.log("Member removed successfully");
    } catch (err) {
        console.log("Error Removing Member from the workspace: ", err);
        throw err;
    }
};

export const getMemberRole = async (workspaceId, userId) => {
    try {
      const result = await pool.query(
        `
         SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 
        `,
        [workspaceId, userId]
      );

      return result.rows[0]?.role;
    } catch (err) {
        console.log("Erro Detecting role of a user: ", err);
        throw err;
    }
};

