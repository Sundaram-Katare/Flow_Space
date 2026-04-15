import pool from "../db/db.js";

export const createChannelsTable = async () => {
    try {
      const result =  await pool.query(
        `
         CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        channel_type VARCHAR(50) DEFAULT 'public',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(workspace_id, name)
      );`
      );

      console.log("Channels Table Created Successfully");
    } catch (err) {
        console.log("Error Creating Channels Table: ", err);
        throw err;
    }
};

export const createChannel = async (workspaceId, name, description, channelType = 'public') => {
    try {
       const result = await pool.query(
        `
         INSERT INTO channels (workspace_id, name, description, channel_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *
        `, [workspaceId, name, description, channelType]
       );

       return result.rows[0];
    } catch (err) {
        console.log("Error Creating Channel: ", err);
        throw err;
    }
};

export const getChannelsByWorkspace = async (workspaceId) => {
    try {
      const result = await pool.query(
        `
         SELECT * FROM channels WHERE workspace_id = $1 ORDER BY created_at ASC
        `, [workspaceId]
      );

      return result.rows;
    } catch (err) {
        console.log("Error Fetching Channels for this workspace: ", err);
        throw err;
    }
};

export const getChannelById = async (channelId) => {
    try {
      const result = await pool.query(
        `
         SELECT * FROM channels where id = $1 
        `, [channelId]
      );
      return result.rows[0];
    } catch (err) {
        console.log('Error Getting Channel by Id: ', err);
        throw err;
    }
};

export const deleteChannel = async (channelId) => {
    try {
      await pool.query(`
         DELETE FROM channels WHERE id = $1
        `, [channelId]);
    } catch (err) {
        console.log('Error Deleting Channel: ', err);
        throw err;
    }
}; 