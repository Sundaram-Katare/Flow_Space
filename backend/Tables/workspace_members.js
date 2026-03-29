import pool from "../db/db.js";

export const createWorkspaceMembersTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE workspace_members (
             id SERIAL PRIMARY KEY,

             user_id INT NOT NULL,
             workspace_id INT NOT NULL,

             role VARCHAR(20) CHECK (role IN ('admin', 'member')) DEFAULT 'member',

             joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
             FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,

             UNIQUE (user_id, workspace_id)
        );
        `);

        console.log("Workspace_Members Table created successfully");
    } catch (err) {
        console.log("Error Creating Workspace Members table: ", err);
    }
};