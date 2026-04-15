import pkg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pkg;

const pool = new Pool({
    connectionString: env.database.connectionString,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    }
});

export default pool;