import pool from "../db/db.js";

export const createWorkspaceMembersTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS workspace_members (
                id SERIAL PRIMARY KEY,
                workspace_id INTEGER,
                user_id INTEGER,
                role ENUM('admin', 'member') DEFAULT 'member',
                FOREIGN KEY (workspace_id) REFERENCES workspaces(id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);
    } catch (err) {
        console.log("Error Creating Workspace Members table: ", err);
    }
};