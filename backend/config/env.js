import dotenv from 'dotenv';

dotenv.config();

export const env = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  database: {
    connectionString: process.env.DATABASE_URL,
  },
  
  redis: {
    url: process.env.REDIS_URL,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret',
    expiry: process.env.JWT_EXPIRY || '7d',
  },
  
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export default env;