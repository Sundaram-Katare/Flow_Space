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

        return res.status(200).json({ message: "Workspace created successfully", newWorkspace});

    } catch (err) {
        return res.status(500).json({ message: "Error in creating workspace", err });
    }
}