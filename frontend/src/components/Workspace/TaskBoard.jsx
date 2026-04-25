import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  updateTaskStatus,
  deleteTask as deleteTaskAction,
  setIsLoading,
  setError,
} from "../../../features/task/taskSlice.js";
import {
  getWorkspaceTasks,
  createTask,
  updateTaskStatus as updateTaskStatusAPI,
  deleteTask as deleteTaskAPI,
} from "../../services/tasks.js";
import { getSocket } from "../../services/socket.js";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";

export default function TaskBoard({ workspaceId }) {
  const dispatch = useDispatch();
  const { tasksByStatus, isLoading } = useSelector((state) => state.tasks);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      dispatch(setIsLoading(true));
      try {
        const data = await getWorkspaceTasks(workspaceId);
        dispatch(setTasks(data.tasks));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    loadTasks();
  }, [workspaceId, dispatch]);

  // Listen for real-time task updates via Socket.io
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("task-created", (task) => {
      dispatch(addTask(task));
    });

    socket.on("task-updated", (task) => {
      dispatch(updateTaskStatus({ taskId: task.id, status: task.status }));
    });

    socket.on("task-status-changed", (data) => {
      dispatch(updateTaskStatus({ taskId: data.taskId, status: data.status }));
    });

    socket.on("task-deleted", (data) => {
      dispatch(deleteTaskAction(data.taskId));
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-status-changed");
      socket.off("task-deleted");
    };
  }, [dispatch]);

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();

    if (!draggedTask) return;

    // If already in same status, do nothing
    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      // Update in backend
      await updateTaskStatusAPI(draggedTask.id, workspaceId, newStatus);

      // Update local state
      dispatch(updateTaskStatus({ taskId: draggedTask.id, status: newStatus }));
    } catch (err) {
      console.error("Failed to update task status:", err);
      alert("Failed to move task");
    } finally {
      setDraggedTask(null);
    }
  };

  const handleCreateTask = async (title, description, priority, assignedTo) => {
    try {
      const data = await createTask(
        workspaceId,
        title,
        description,
        priority,
        assignedTo
      );
      dispatch(addTask(data.task));
      setShowCreateForm(false);
    } catch (err) {
      alert("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTaskAPI(taskId, workspaceId);
      dispatch(deleteTaskAction(taskId));
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading tasks...</div>;
  }

  return (
    <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">📊 Task Board</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg"
        >
          + New Task
        </button>
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <CreateTaskForm
          onCreate={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
          workspaceId={workspaceId}
        />
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "todo")}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-red-500 text-white p-4">
            <h3 className="text-lg font-bold">📋 TODO</h3>
            <p className="text-sm opacity-90">{tasksByStatus.todo.length} tasks</p>
          </div>
          <div className="p-4 space-y-3 min-h-96">
            {tasksByStatus.todo.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleDeleteTask}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        </div>

        {/* IN_PROGRESS Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "in_progress")}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-yellow-500 text-white p-4">
            <h3 className="text-lg font-bold">🔄 IN PROGRESS</h3>
            <p className="text-sm opacity-90">{tasksByStatus.in_progress.length} tasks</p>
          </div>
          <div className="p-4 space-y-3 min-h-96">
            {tasksByStatus.in_progress.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleDeleteTask}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "done")}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-green-500 text-white p-4">
            <h3 className="text-lg font-bold">✅ DONE</h3>
            <p className="text-sm opacity-90">{tasksByStatus.done.length} tasks</p>
          </div>
          <div className="p-4 space-y-3 min-h-96">
            {tasksByStatus.done.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={handleDeleteTask}
                workspaceId={workspaceId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}