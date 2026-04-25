import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentDoc, setIsLoading } from "../../../features/docs/docSlice.js";
import { getDoc } from "../../services/docs.js";
import DocsList from "./DocsList";
import DocEditor from "./DocEditor";

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
      alert("Failed to load document");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar with docs list */}
        <div className="lg:col-span-1">
          <DocsList workspaceId={workspaceId} onSelectDoc={handleSelectDoc} />
        </div>

        {/* Main editor */}
        <div className="lg:col-span-3">
          {currentDoc ? (
            <DocEditor
              docId={currentDoc.id}
              workspaceId={workspaceId}
              key={currentDoc.id}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-500 text-lg">
                Select a document to start editing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}