import pool from "../db/db.js";

export const createTasksTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(50) DEFAULT 'medium',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tasks Table Created Successfully");
  } catch (err) {
    console.log("Error Creating Tasks Table:", err);
    throw err;
  }
};

export const createTask = async (workspaceId, title, description, createdBy, assignedTo = null, priority = "medium") => {
  try {
    const result = await pool.query(
      `INSERT INTO tasks (workspace_id, title, description, created_by, assigned_to, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [workspaceId, title, description, createdBy, assignedTo, priority]
    );
    return result.rows[0];
  } catch (err) {
    console.log("❌ Error Creating Task:", err);
    throw err;
  }
};

export const getWorkspaceTasks = async (workspaceId) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username as assigned_username, c.username as created_username
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN users c ON t.created_by = c.id
       WHERE t.workspace_id = $1
       ORDER BY t.created_at DESC`,
      [workspaceId]
    );
    return result.rows;
  } catch (err) {
    console.log("Error Getting Tasks:", err);
    throw err;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const { title, description, status, priority, assigned_to } = updates;
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           assigned_to = COALESCE($5, assigned_to),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, status, priority, assigned_to, taskId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Updating Task:", err);
    throw err;
  }
};

export const deleteTask = async (taskId) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
  } catch (err) {
    console.log("Error Deleting Task:", err);
    throw err;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("❌ Error Getting Task:", err);
    throw err;
  }
};

export const getTasksByStatus = async (workspaceId, status) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username as assigned_username, c.username as created_username
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN users c ON t.created_by = c.id
       WHERE t.workspace_id = $1 AND t.status = $2
       ORDER BY t.created_at DESC`,
      [workspaceId, status]
    );
    return result.rows;
  } catch (err) {
    console.log("❌ Error Getting Tasks by Status:", err);
    throw err;
  }
};

export const getUserTasks = async (userId, workspaceId = null) => {
  try {
    let query = `SELECT t.*, w.name as workspace_name, c.username as created_username
                 FROM tasks t
                 JOIN workspaces w ON t.workspace_id = w.id
                 WHERE t.assigned_to = $1`;
    let params = [userId];

    if (workspaceId) {
      query += ` AND t.workspace_id = $2`;
      params.push(workspaceId);
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.log("❌ Error Getting User Tasks:", err);
    throw err;
  }
};