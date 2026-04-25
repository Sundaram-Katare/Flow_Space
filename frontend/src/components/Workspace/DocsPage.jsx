import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDoc, setIsLoading } from "../../../features/docs/docSlice.js";
import { getDoc } from "../../services/docs.js";
import DocList from "./DocList";
import DocEditor from "./DocEditor";
import { FileText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocsPage({ workspaceId }) {
  const dispatch = useDispatch();
  const { currentDoc, isLoading } = useSelector((state) => state.docs);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleSelectDoc = async (docId) => {
    setSelectedDocId(docId);
    dispatch(setIsLoading(true));

    try {
      const data = await getDoc(docId);
      dispatch(setCurrentDoc(data.doc));
    } catch (err) {
      console.error("Failed to load document:", err);
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="h-full bg-[#F8FAFC] flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with docs list */}
        <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
          <DocList workspaceId={workspaceId} onSelectDoc={handleSelectDoc} selectedDocId={selectedDocId} />
        </div>

        {/* Main editor area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10"
              >
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading document...</p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="h-full overflow-y-auto">
            {currentDoc ? (
              <DocEditor
                docId={currentDoc.id}
                workspaceId={workspaceId}
                key={currentDoc.id}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Document Selected</h3>
                <p className="text-slate-500 max-w-xs">
                  Choose a document from the sidebar or create a new one to start writing.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}