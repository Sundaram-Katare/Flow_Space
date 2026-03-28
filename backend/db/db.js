import pkg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

export default pool;