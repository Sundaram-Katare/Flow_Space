import pool from "../db/db.js";

export const createUserTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users Table Created Successfully");
  } catch (err) {
    console.log("Error Creating Users Table:", err);
    throw err;
  }
};

export const updateTable = async () => {
  try {
    await pool.query(
      `ALTER TABLE users
       ADD COLUMN status VARCHAR(20)
      `
    )
  } catch (err) {
    console.log("Error Updating Table", err);
    throw err;
  }
}