import pool from "../db/db.js";

export const createDocsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS docs (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content JSONB DEFAULT '{"blocks": []}',
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Docs Table Created Successfully");
  } catch (err) {
    console.log("Error Creating Docs Table:", err);
    throw err;
  }
};

export const createDoc = async (workspaceId, title, createdBy, content = {}) => {
  try {
    const result = await pool.query(
      `INSERT INTO docs (workspace_id, title, created_by, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspaceId, title, createdBy, JSON.stringify(content)]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Creating Doc:", err);
    throw err;
  }
};

export const getWorkspaceDocs = async (workspaceId) => {
  try {
    const result = await pool.query(
      `SELECT d.id, d.title, d.workspace_id, d.created_by, u.username, 
              d.created_at, d.updated_at
       FROM docs d
       JOIN users u ON d.created_by = u.id
       WHERE d.workspace_id = $1
       ORDER BY d.updated_at DESC`,
      [workspaceId]
    );
    return result.rows;
  } catch (err) {
    console.log("Error Getting Docs:", err);
    throw err;
  }
};

export const getDocById = async (docId) => {
  try {
    const result = await pool.query(
      `SELECT d.*, u.username
       FROM docs d
       JOIN users u ON d.created_by = u.id
       WHERE d.id = $1`,
      [docId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Getting Doc:", err);
    throw err;
  }
};

export const updateDoc = async (docId, title, content) => {
  try {
    const result = await pool.query(
      `UPDATE docs
       SET title = COALESCE($1, title), 
           content = COALESCE($2, content),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [title, JSON.stringify(content), docId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Updating Doc:", err);
    throw err;
  }
};

export const deleteDoc = async (docId) => {
  try {
    await pool.query('DELETE FROM docs WHERE id = $1', [docId]);
  } catch (err) {
    console.log("Error Deleting Doc:", err);
    throw err;
  }
};