import dotenv from 'dotenv';

dotenv.config();

export const env = {
    DB_URL: process.env.DATABASE_URL,
}

