const { createUserTable } = require("../Tables/users.js");
const { createWorkspacesTable } = require("../Tables/workspaces.js");
const { createWorkspaceMembersTable } = require("../Tables/workspace_members.js");
const { createChannelsTable } = require("../Tables/channels.js");
const { createMessagesTable } = require("../Tables/messages.js");
const { createTasksTable } = require("../Tables/tasks.js");
// const { createDocsTable } = require("../Tables/docs.js");

const initializeTables = async () => {
  try {
    console.log("Initializing database tables...");

    await createUserTable();
    await createWorkspacesTable();
    await createWorkspaceMembersTable();
    await createChannelsTable();
    await createMessagesTable();
    await createTasksTable();
    // await createDocsTable();

    console.log("All tables initialized successfully");
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
};

module.exports = { initializeTables };
