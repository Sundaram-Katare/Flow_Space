import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchWorkspacesStart,
  fetchWorkspacesSuccess,
  fetchWorkspacesFailure,
  setCurrentWorkspace,
} from "../../features/workspace/workspaceSlice";
import { getUserWorkspaces } from "../services/workspace";
import CreateWorkspace from "./CreateWorkspace";
import JoinWorkspace from "./JoinWorkspace";

export default function WorkspaceSwitcher() {
  const dispatch = useDispatch();
  const { workspaces, currentWorkspace } = useSelector((state) => state.workspace);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      dispatch(fetchWorkspacesStart());
      try {
        const data = await getUserWorkspaces();
        dispatch(fetchWorkspacesSuccess(data.workspaces));
        
        // Set first workspace as current if not set
        if (data.workspaces.length > 0 && !currentWorkspace) {
          dispatch(setCurrentWorkspace(data.workspaces[0]));
        }
      } catch (err) {
        dispatch(fetchWorkspacesFailure(err.message));
      }
    };

    fetchWorkspaces();
  }, [dispatch, currentWorkspace]);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700">Workspaces</h3>
      </div>

      {/* Current Workspace */}
      {currentWorkspace && (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-3">
          <p className="text-sm font-semibold text-blue-900">
            {currentWorkspace.name}
          </p>
          <p className="text-xs text-blue-700">Current</p>
        </div>
      )}

      {/* Workspace List */}
      <div className="space-y-2 mb-4">
        {/* {workspaces.map((workspace) => (
          <button
            key={workspace.id}
            onClick={() => dispatch(setCurrentWorkspace(workspace))}
            className={`w-full text-left px-3 py-2 rounded-lg transition ${
              currentWorkspace?.id === workspace.id
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <p className="font-medium text-sm">{workspace.name}</p>
            <p className="text-xs opacity-70">{workspace.description}</p>
          </button>
        ))} */}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
        >
          + Create
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold"
        >
          + Join
        </button>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateWorkspace onClose={() => setShowCreateModal(false)} />}
      {showJoinModal && <JoinWorkspace onClose={() => setShowJoinModal(false)} />}
    </div>
  );
}