import dotenv from 'dotenv';
import * as tables from '../Tables/index.js';

dotenv.config();

const initializeDb = async () => {
  try {
    console.log("Starting database initialization...");
    
    for (const [tableName, createFn] of Object.entries(tables)) {
      console.log(`Executing ${tableName}...`);
      await createFn();
    }
    
    console.log("Database initialization completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
};

initializeDb();