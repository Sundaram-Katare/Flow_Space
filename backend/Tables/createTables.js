import pool from "../db/db.js";
import dotenv from 'dotenv';

dotenv.config();

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
    console.log("Table Created");
  } catch (err) {
    console.log("Error Creating Tables:", err);
  }
};

createUserTable();