import { useState } from "react";
import { updateTask } from "../../services/tasks.js";
import { useDispatch } from "react-redux";
import { updateTask as updateTaskAction } from "../../../features/task/taskSlice.js";
import { 
  AlertCircle, 
  Clock, 
  ArrowUpCircle, 
  Zap, 
  X, 
  Edit3, 
  Trash2, 
  User, 
  Calendar,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskCard({ task, onDragStart, onDelete, workspaceId }) {
  const dispatch = useDispatch();
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedPriority, setEditedPriority] = useState(task.priority || "medium");

  const handleSaveEdit = async () => {
    try {
      const data = await updateTask(task.id, workspaceId, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
      });
      dispatch(updateTaskAction(data.task));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const priorityConfig = {
    low: { color: "text-blue-600 bg-blue-50 border-blue-100", icon: Clock },
    medium: { color: "text-amber-600 bg-amber-50 border-amber-100", icon: AlertCircle },
    high: { color: "text-orange-600 bg-orange-50 border-orange-100", icon: ArrowUpCircle },
    urgent: { color: "text-rose-600 bg-rose-50 border-rose-100", icon: Zap },
  };

  const currentPriority = priorityConfig[task.priority] || priorityConfig.medium;

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, task)}
        onClick={() => setShowDetails(true)}
        className="group bg-black text-white border border-slate-200 rounded-2xl p-4 cursor-grab active:cursor-grabbing hover:border-teal-400 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 relative"
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${currentPriority.color}`}>
            <currentPriority.icon size={12} />
            {task.priority}
          </div>
          <button className="text-slate-300 hover:text-slate-600 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <h4 className="font-bold text-white text-sm leading-snug mb-2 group-hover:text-teal-200 transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-white mb-4 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center text-white justify-between pt-3 border-t border-slate-50">
          <div className="flex -space-x-2">
            {task.assigned_username ? (
              <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold border-2 border-white ring-1 ring-teal-100 shadow-sm text-white" title={task.assigned_username}>
                {task.assigned_username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border-2 border-white ring-1 ring-slate-50 shadow-sm">
                <User size={12} />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-white">
            <Calendar size={12} />
            <span className="text-[10px] font-medium">Apr 26</span>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-slate-200"
            >
              {/* Modal Header */}
              <div className="bg-teal-600 p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                <div className="flex justify-between items-start relative z-10">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-widest`}>
                    <currentPriority.icon size={14} />
                    {task.priority} Priority
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
                <h3 className="text-2xl font-extrabold mt-6 tracking-tight leading-tight">
                  {isEditing ? "Edit Task Details" : task.title}
                </h3>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Task Title</label>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
                        rows="4"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                        <select
                          value={editedPriority}
                          onChange={(e) => setEditedPriority(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium appearance-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-lg shadow-teal-200/50 transition-all"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                      <p className="text-slate-600 leading-relaxed font-medium">
                        {task.description || "No description provided for this task."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Status</span>
                        <div className="flex items-center gap-2 text-teal-600 font-bold">
                          <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                          {task.status?.toUpperCase().replace("_", " ")}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Assignee</span>
                        <div className="flex items-center gap-2 text-slate-800 font-bold">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User size={12} className="text-slate-400" />
                          </div>
                          {task.assigned_username || "Unassigned"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Created By</span>
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                          {task.created_username}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 rounded-2xl font-bold hover:bg-amber-100 transition-all"
                      >
                        <Edit3 size={18} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this task?")) {
                            setShowDetails(false);
                            onDelete(task.id);
                          }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-700 rounded-2xl font-bold hover:bg-rose-100 transition-all"
                      >
                        <Trash2 size={18} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}