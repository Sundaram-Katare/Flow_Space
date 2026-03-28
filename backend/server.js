import express from 'express';
import pool from './db/db.js';
import { env } from './config/env.js';
import { createUserTable } from './Tables/createTables.js';

const app = express();

console.log("DB URL 🙂 ", env.DB_URL);

app.use(express.json());

pool.connect()
    .then(() => console.log('Connected to Neon DB'))
    .catch(() => console.log('Failed to connect with the Database'));


    createUserTable();

app.listen(5000, () => {
    console.log(`Server is running on PORT 5000`);
});