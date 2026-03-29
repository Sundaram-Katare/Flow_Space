import express from 'express';
import pool from './db/db.js';
import { env } from './config/env.js';

const app = express();

console.log("DB URL 🙂 ", env.DB_URL);

app.use(express.json());

pool.connect()
    .then(() => console.log('Connected to Neon DB'))
    .catch(() => console.log('Failed to connect with the Database'));


app.listen(5000, () => {
    console.log(`Server is running on PORT 5000`);
});