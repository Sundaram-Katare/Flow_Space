const pkg =  require('pg');
const { env } = require('../config/env');

const { Pool } = pkg;

const pool = new Pool({
    connectionString: env.DB_URL,
    ssl: {
        require: true,
        rejectUnauthorized: false,
    }
});

export default pool;