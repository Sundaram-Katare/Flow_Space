import {
  createTask,
  getWorkspaceTasks,
  updateTask,
  deleteTask,
} from "../Tables/tasks.js";
import { getMemberRole } from "../Tables/workspace_members.js";
import * as cache from "../services/cache.js";

export const createTaskController = async (req, res) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;
    const { title, description, priority, assignedTo } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title required" });
    }

    // const role = await getMemberRole(workspaceId, userId);
    // if (!role) {
    //   return res.status(403).json({ error: "Not a member of this workspace" });
    // }

    const task = await createTask(
      workspaceId,
      title,
      description || "",
      userId, 
      assignedTo || null,
      priority || "medium"
    );

    await cache.del(`tasks:${workspaceId}`);

    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("task-created", task);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getWorkspaceTasksController = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const cacheKey = `tasks:${workspaceId}`;
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.json({ tasks: cached });
    }

    const tasks = await getWorkspaceTasks(workspaceId);

    await cache.set(cacheKey, tasks, 1800);

    res.json({ tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Failed to get tasks" });
  }
};

export const updateTaskController = async (req, res) => {
  try {
    const { taskId, workspaceId } = req.params;
    const userId = req.userId;
    const { title, description, status, priority, assigned_to } = req.body;

    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    const updates = {
      title,
      description,
      status,
      priority,
      assigned_to,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] === undefined) delete updates[key];
    });

    const task = await updateTask(taskId, updates);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await cache.del(`tasks:${workspaceId}`);

    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("task-updated", task);

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const updateTaskStatusController = async (req, res) => {
  try {
    const { taskId, workspaceId } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const validStatuses = ["todo", "in_progress", "done"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const role = await getMemberRole(workspaceId, userId);
    if (!role) {
      return res.status(403).json({ error: "Not a member of this workspace" });
    }

    const task = await updateTask(taskId, { status });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await cache.del(`tasks:${workspaceId}`);

    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("task-status-changed", {
      taskId: task.id,
      status: task.status,
      updated_at: task.updated_at,
    });

    res.json({
      message: "Task status updated",
      task,
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update task status" });
  }
};

export const deleteTaskController = async (req, res) => {
  try {
    const { taskId, workspaceId } = req.params;
    const userId = req.userId;

    // const role = await getMemberRole(workspaceId, userId);
    // if (role !== "admin") {
    //   return res.status(403).json({ error: "Only admins can delete tasks" });
    // }

    await deleteTask(taskId);

    await cache.del(`tasks:${workspaceId}`);

    const io = req.app.get("io");
    io.to(`workspace:${workspaceId}`).emit("task-deleted", { taskId });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

export const getTasksByStatusController = async (req, res) => {
  try {
    const { workspaceId, status } = req.params;

    const tasks = await getWorkspaceTasks(workspaceId);
    const filtered = tasks.filter((t) => t.status === status);

    res.json({ tasks: filtered, status });
  } catch (err) {
    console.error("Get tasks by status error:", err);
    res.status(500).json({ error: "Failed to get tasks" });
  }
};

export const getMyTasksController = async (req, res) => {
  try {
    const userId = req.userId;
    const { workspaceId } = req.params;

    const tasks = await getWorkspaceTasks(workspaceId);
    const myTasks = tasks.filter((t) => t.assigned_to === userId);

    res.json({ tasks: myTasks });
  } catch (err) {
    console.error("Get my tasks error:", err);
    res.status(500).json({ error: "Failed to get tasks" });
  }
};