import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDocs, addDoc, setCurrentDoc, deleteDoc } from "../../../features/docs/docSlice.js";
import {
  getWorkspaceDocs,
  createDoc,
  deleteDocAPI,
} from "../../services/docs.js";
import { onDocCreated, onDocDeleted } from "../../services/socket.js";

export default function DocsList({ workspaceId, onSelectDoc }) {
  const dispatch = useDispatch();
  const { docs } = useSelector((state) => state.docs);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Listen for real-time doc creation
  useEffect(() => {
    onDocCreated((doc) => {
      dispatch(addDoc(doc));
    });

    onDocDeleted((data) => {
      dispatch(deleteDoc(data.docId));
    });

    return () => {
      // Cleanup
    };
  }, [dispatch]);

  const handleCreateDoc = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setLoading(true);
    try {
      const data = await createDoc(workspaceId, newDocTitle);
      dispatch(addDoc(data.doc));
      setNewDocTitle("");
      setShowCreateForm(false);
      
      // Auto-select new doc
      onSelectDoc(data.doc.id);
    } catch (err) {
      alert("Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await deleteDocAPI(docId, workspaceId);
      dispatch(deleteDoc(docId));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-96">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4">
        <h3 className="font-bold text-lg">📝 Documents</h3>
      </div>

      {/* Docs list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {docs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No documents yet</p>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              onClick={() => onSelectDoc(doc.id)}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{doc.title}</p>
                <p className="text-xs text-gray-500">By {doc.username}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDoc(doc.id);
                }}
                className="p-1 hover:bg-red-100 text-red-600 rounded transition"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create form */}
      <div className="border-t border-gray-200 p-4">
        {showCreateForm ? (
          <form onSubmit={handleCreateDoc} className="space-y-2">
            <input
              type="text"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Document name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !newDocTitle.trim()}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            + New Document
          </button>
        )}
      </div>
    </div>
  );
}