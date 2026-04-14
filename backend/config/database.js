const { Pool } = require('pg');
const env = require('./env');

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

module.exports = pool;