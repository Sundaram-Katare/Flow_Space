import pool from "../db/db.js";

export const createWorkspaceTable = async () => {
    try {
        await pool.query(`
         CREATE TABLE IF NOT EXISTS workspaces (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100),
          invite_code INT,
          owner_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (owner_id) REFERENCES users(id)
         );
         `)
    } catch (err) {
        console.log("Error Creating Workspace table: ", err);
    }
}