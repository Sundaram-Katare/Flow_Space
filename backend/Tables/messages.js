import pool from "../db/db.js";

export const createMessagesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log(" Messages Table Created Successfully");
  } catch (err) {
    console.log("Error Creating Messages Table:", err);
    throw err;
  }
};

export const createMessage = async (channelId, userId, content) => {
  try {
    const result = await pool.query(
      `INSERT INTO messages (channel_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [channelId, userId, content]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Creating Message:", err);
    throw err;
  }
};

export const getChannelMessages = async (channelId, limit = 50, offset = 0) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.username, u.avatar
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.channel_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [channelId, limit, offset]
    );
    return result.rows.reverse();
  } catch (err) {
    console.log("Error Getting Messages:", err);
    throw err;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    await pool.query('DELETE FROM messages WHERE id = $1', [messageId]);
  } catch (err) {
    console.log("Error Deleting Message:", err);
    throw err;
  }
};

export const updateMessage = async (messageId, content) => {
  try {
    const result = await pool.query(
      `UPDATE messages 
       SET content = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [content, messageId]
    );
    return result.rows[0];
  } catch (err) {
    console.log("Error Updating Message:", err);
    throw err;
  }
};