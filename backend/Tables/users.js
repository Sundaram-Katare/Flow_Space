import pool from "../db/db.js";

export const createUserTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar TEXT,
        status VARCHAR(20) DEFAULT 'online',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users Table Created Successfully");
  } catch (err) {
    console.log("Error Creating Users Table:", err);
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
     const result = await pool.query(
      'SELECT id, email, username, first_name, last_name, avatar FROM users WHERE id = $1',
      [userId]
     );
  } catch (err) {
    console.log('Error Getting User', err);
    throw err;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
  } catch (err) {
    console.log("Error Getting User: ", err);
    throw err;
  }
};

export const createUser = async (email, username, hashedPassword, firstName, lastName) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO users (email, username, password, first_name, last_name)
      VALUES ($1, $2, $3, $4) 
      RETURNING id, email, username, first_name, last_name
      `, [email, username, hashedPassword, firstName, lastName]
    );
  } catch (err) {
    console.log("Error Creating User: ", err);
    throw err;
  }
};