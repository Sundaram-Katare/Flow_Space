import { useState } from "react";
import { useSelector } from "react-redux";
import { getWorkspaceMembers } from "../../services/workspace.js";
import { useEffect } from "react";
import { X, Plus, User, Flag, AlignLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateTaskForm({ onCreate, onCancel, workspaceId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load workspace members
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data.members || []);
      } catch (err) {
        console.error("Failed to load members:", err);
      }
    };
    loadMembers();
  }, [workspaceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreate(
        title,
        description,
        priority,
        assignedTo ? parseInt(assignedTo) : null
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-slate-200"
      >
        {/* Header */}
        <div className="bg-teal-600 p-8 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                <Plus size={20} />
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">New Task</h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-teal-50 mt-2 font-medium opacity-80">Define what needs to be done</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <CheckCircle2 size={16} className="text-teal-500" />
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design System Update"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <AlignLeft size={16} className="text-teal-500" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Flag size={16} className="text-teal-500" />
                Priority
              </label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium appearance-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Flag size={14} />
                </div>
              </div>
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <User size={16} className="text-teal-500" />
                Assignee
              </label>
              <div className="relative">
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium appearance-none"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.username}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <User size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 disabled:opacity-50 shadow-lg shadow-teal-200/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Plus size={18} />
              )}
              <span>{loading ? "Creating..." : "Create Task"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}