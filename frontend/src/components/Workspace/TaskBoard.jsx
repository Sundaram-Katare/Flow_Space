import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Layout, 
  ListTodo, 
  RotateCcw, 
  CheckCircle2, 
  Search,
  Filter,
  MoreVertical,
  Loader2
} from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

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

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await updateTaskStatusAPI(draggedTask.id, workspaceId, newStatus);
      dispatch(updateTaskStatus({ taskId: draggedTask.id, status: newStatus }));
    } catch (err) {
      console.error("Failed to update task status:", err);
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
      console.error("Failed to create task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskAPI(taskId, workspaceId);
      dispatch(deleteTaskAction(taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#FDFDFD]">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading your board...</p>
      </div>
    );
  }

  const columns = [
    { id: "todo", title: "To Do", icon: ListTodo, color: "teal", tasks: tasksByStatus.todo },
    { id: "in_progress", title: "In Progress", icon: RotateCcw, color: "blue", tasks: tasksByStatus.in_progress },
    { id: "done", title: "Done", icon: CheckCircle2, color: "emerald", tasks: tasksByStatus.done },
  ];

  return (
    <div className="h-full flex flex-col bg-[#FDFDFD]">
      {/* Header Section */}
      <div className="p-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                <Layout size={24} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Board</h1>
            </div>
            <p className="text-slate-500 font-medium ml-12">Manage and track your team's progress</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/20 w-64 transition-all"
              />
            </div>
            <button className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all">
              <Filter size={20} />
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold shadow-lg shadow-teal-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <div className="flex-1 overflow-x-auto p-8 pt-4">
        <div className="flex gap-8 h-full min-w-max">
          {columns.map((column) => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className="w-80 lg:w-96 flex flex-col bg-slate-50/50 rounded-[24px] border border-slate-100 overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-5 flex items-center justify-between border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${column.color}-50 text-${column.color}-600`}>
                    <column.icon size={18} />
                  </div>
                  <h3 className="font-bold text-slate-800 tracking-tight">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold">
                    {column.tasks.length}
                  </span>
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>

              {/* Task List */}
              <div className="flex-1 bg-slate-100 p-4 space-y-4 overflow-y-auto no-scrollbar min-h-[400px]">
                <AnimatePresence mode="popLayout">
                  {column.tasks
                    .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TaskCard
                          task={task}
                          onDragStart={handleDragStart}
                          onDelete={handleDeleteTask}
                          workspaceId={workspaceId}
                        />
                      </motion.div>
                    ))}
                </AnimatePresence>
                
                {column.tasks.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 space-y-2 border-2 border-dashed border-slate-200 rounded-2xl">
                    <p className="text-sm font-medium">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Form Modal */}
      {showCreateForm && (
        <CreateTaskForm
          onCreate={handleCreateTask}
          onCancel={() => setShowCreateForm(false)}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}