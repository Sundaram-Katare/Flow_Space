import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

const pool = new Pool(
    {
        connectionString: env.database.connectionString
    }
);

pool.on('connect', () => {
    console.log('Postgres DB Connected');
});

pool.on('error', (err) => {
    console.error('Postgres Erro: ', err);
});

export default pool;