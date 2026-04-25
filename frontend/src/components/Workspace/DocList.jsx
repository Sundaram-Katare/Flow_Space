import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocs, addDoc, deleteDoc } from "../../../features/docs/docSlice.js";
import {
  getWorkspaceDocs,
  createDoc,
  deleteDocAPI,
} from "../../services/docs.js";
import { onDocCreated, onDocDeleted } from "../../services/socket.js";
import { FileText, Plus, Trash2, Search, MoreVertical, FilePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocList({ workspaceId, onSelectDoc, selectedDocId }) {
  const dispatch = useDispatch();
  const { docs } = useSelector((state) => state.docs);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Load docs on mount
  useEffect(() => {
    const loadDocs = async () => {
      try {
        const data = await getWorkspaceDocs(workspaceId);
        dispatch(setDocs(data.docs));
      } catch (err) {
        console.error("Failed to load docs:", err);
      }
    };

    loadDocs();
  }, [workspaceId, dispatch]);

  // Listen for real-time doc events
  useEffect(() => {
    const unsubscribeCreated = onDocCreated((doc) => {
      dispatch(addDoc(doc));
    });

    const unsubscribeDeleted = onDocDeleted((data) => {
      dispatch(deleteDoc(data.docId));
    });

    return () => {
      if (unsubscribeCreated) unsubscribeCreated();
      if (unsubscribeDeleted) unsubscribeDeleted();
    };
  }, [dispatch]);

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setLoading(true);
    try {
      const data = await createDoc(workspaceId, newDocTitle);
      // addDoc might be handled by socket already, but we add it manually if socket is not reliable
      // Or if the backend doesn't emit to the creator.
      // Based on controller, it emits to the room.
      setNewDocTitle("");
      setShowCreateForm(false);
      onSelectDoc(data.doc.id);
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoc = async (e, docId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await deleteDocAPI(docId, workspaceId);
      dispatch(deleteDoc(docId));
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const filteredDocs = docs.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-teal-600" size={20} />
            Documents
          </h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="p-1.5 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition-colors"
            title="New Document"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-2 mb-2 bg-teal-50/50 rounded-xl border border-teal-100"
            >
              <form onSubmit={handleCreateDoc} className="space-y-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Doc title..."
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <div className="flex gap-2">
                  <button
                    disabled={loading || !newDocTitle.trim()}
                    type="submit"
                    className="flex-1 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-1.5 bg-white text-slate-600 text-xs font-bold border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <FilePlus size={32} className="mb-2 opacity-20" />
            <p className="text-xs font-medium">No documents found</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <motion.div
              layout
              key={doc.id}
              onClick={() => onSelectDoc(doc.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                selectedDocId === doc.id
                  ? "bg-teal-50 text-teal-700 shadow-sm shadow-teal-100"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedDocId === doc.id ? "bg-teal-100 text-teal-600" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                }`}>
                  <FileText size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{doc.title}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {new Date(doc.created_at).toLocaleDateString()} • {doc.username || 'System'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => handleDeleteDoc(e, doc.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}