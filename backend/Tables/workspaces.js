const pool = require('../db/db');

export const createWorkspacesTable = async () => {
    try {
        await pool.query(`
         CREATE TABLE IF NOT EXISTS workspaces (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        workspace_code VARCHAR(20) UNIQUE,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
         `);
         console.log('Workspaces Table Created Successfully');
    } catch (err) {
        console.log("Error Creating Workspace table: ", err);
    }
};

export const createdWorkspace = async (userId, name, description, workspaceCode) => {
    try {
      const result = await pool.query(`
         INSERT INTO workspaces (userId, name, descriptio, workspace_code)
         VALUES ($1, $2, $3, $4)
         RETURNING *
        `, [userId, name, description, workspaceCode]
    );
    return result.rows[0];
    } catch (err) {
        console.log("Error Creating a Workspace: ", err);
    }
};

export const getWorkspaceById = async (workspaceId) => {
    try {
      const result = await pool.query(
        `
         SELECT * FROM workspaces 
         WHERE id = $1
        `,
        [workspaceId]
      );

      return result.rows[0];
    } catch (err) {
        console.log("Error Getting Workspace: ", err);
        throw err;
    }
};

export const getUserWorkspaces = async (userId) => {
    try {
      const result = await pool.query(
        `
         SELECT w.* FROM workspaces w
         WHERE w.user_id = $1 OR w.id IN (
           SELECT workspace_id FROM workspace_members WHERE user_id = $1
         )
         ORDER BY w.created_at DESC  
        `,
        [userId]
      );

      return result.rows;
    } catch (err) {
        console.log("Error getting workspaces of a user: ", err);
        throw err;
    }
};

export const updateWorkspace = async (workspaceId, name, description) => {
  try {
    const result = await pool.query(
      `UPDATE workspaces 
       SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, workspaceId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Updating Workspace:", err);
    throw err;
  }
};

export const deleteWorkspace = async (workspaceId) => {
  try {
    await pool.query('DELETE FROM workspaces WHERE id = $1', [workspaceId]);
  } catch (err) {
    console.log("Error Deleting Workspace:", err);
    throw err;
  }
};

export const getWorkspaceByCode = async (code) => {
  try {
    const result = await pool.query(`
       SELECT * FROM workspaces 
       WHERE workspace_code = $1
      `, [code]);

      return result.rows[0];
  } catch (err) {
    console.log("Error Getting Workspace from the code: ", err);
    throw err;
  }
};

export const getWorkspaceWithMembers = async (workspaceId) => {
  try {
    const workspace = getWorkspaceById(workspaceId);

    const members = await pool.query(`
       SELECT u.id, u.username, u.email, u.avatar, wm.role, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON wm.user_id = u.id
       WHERE wm.workspace_id = $1
       ORDER BY wm.joined_at ASC
      `, [workspaceId]);

      return {
        ...workspace,
        members: members.rows,
        member_count: members.rows.length,
      };

  } catch (err) {
    console.log("Error Getting Workspace with members: ", err);
    throw err;
  }
};

export const updateWorkspaceCode = async (workspaceId) => {
  try {
    const newCode = await ensureUniqueCode(getWorkspaceByCode);
    
    const result = await pool.query(
      'UPDATE workspaces SET workspace_code = $1 WHERE id = $2 RETURNING *',
      [newCode, workspaceId]
    );
    
    return result.rows[0];
  } catch (err) {
    console.log("❌ Error Updating Workspace Code:", err);
    throw err;
  }
};