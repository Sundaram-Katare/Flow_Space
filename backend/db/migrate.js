import pool from '../config/database.js';

const createTablesSQL = `
  -- Drop tables if they exist (for fresh setup)
  DROP TABLE IF EXISTS docs;
  DROP TABLE IF EXISTS tasks;
  DROP TABLE IF EXISTS messages;
  DROP TABLE IF EXISTS channels;
  DROP TABLE IF EXISTS workspace_members;
  DROP TABLE IF EXISTS workspaces;
  DROP TABLE IF EXISTS users;

  -- Users table
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Workspaces table
  CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workspace_code VARCHAR(20) UNIQUE,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Workspace members (many-to-many: users to workspaces)
  CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, user_id)
  );

  -- Channels (like Slack channels)
  CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel_type VARCHAR(50) DEFAULT 'public',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, name)
  );

  -- Messages (chat messages in channels)
  CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    channel_id INTEGER NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Tasks (Kanban board)
  CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Docs (Notion-style documents)
  CREATE TABLE docs (
    id SERIAL PRIMARY KEY,
    workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content JSONB,
    created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create indexes for common queries (speeds up searches)
  CREATE INDEX idx_workspace_user ON workspaces(user_id);
  CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
  CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
  CREATE INDEX idx_channels_workspace ON channels(workspace_id);
  CREATE INDEX idx_messages_channel ON messages(channel_id);
  CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
  CREATE INDEX idx_docs_workspace ON docs(workspace_id);
`;

// Run migration
async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');
    await client.query(createTablesSQL);
    console.log('✅ Database setup completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    process.exit(0);
  }
}

migrate();