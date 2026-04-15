import { createUserTable } from "../Tables/users.js";
import { createWorkspacesTable } from "../Tables/workspaces.js";
import { createWorkspaceMembersTable } from "../Tables/workspace_members.js";
import { createChannelsTable } from "../Tables/channels.js";
import { createMessagesTable } from "../Tables/messages.js";
import { createTasksTable } from "../Tables/tasks.js";

const initializeTables = async () => {
  try {
    console.log("Initializing database tables...");

    await createUserTable();
    await createWorkspacesTable();
    await createWorkspaceMembersTable();
    await createChannelsTable();
    await createMessagesTable();
    await createTasksTable();

    console.log("All tables initialized successfully");
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
};

export { initializeTables };
