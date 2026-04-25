import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_8rbN2qxfLKmA@ep-morning-meadow-anly9aix-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require",
    ssl: {
        require: true,
        rejectUnauthorized: false,
    }
});

async function check() {
    try {
        const res = await pool.query("SELECT * FROM channels LIMIT 5;");
        console.log("Channels:", res.rows);
        const res2 = await pool.query("SELECT * FROM workspaces LIMIT 5;");
        console.log("Workspaces:", res2.rows);
    } catch (err) {
        console.error("DB Error:", err);
    } finally {
        await pool.end();
    }
}

check();
