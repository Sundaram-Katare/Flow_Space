import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import WorkspaceSwitcher from "../components/WorkspaceSwitcher";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { currentWorkspace } = useSelector((state) => state.workspace);

  useEffect(() => {
    // Redirect to login if no token
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleWorkspaceClick = () => {
    if (currentWorkspace) {
      navigate(`/workspace/${currentWorkspace.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">FlowSpace</h1>
        </div>
        <WorkspaceSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Welcome to FlowSpace</h2>

          {currentWorkspace ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">
                {currentWorkspace.name}
              </h3>
              {currentWorkspace.description && (
                <p className="text-gray-600 mb-6">{currentWorkspace.description}</p>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">Share this code:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-4 py-2 rounded font-mono font-bold text-lg">
                    {currentWorkspace.workspace_code}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(currentWorkspace.workspace_code);
                      alert("Code copied!");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                onClick={handleWorkspaceClick}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Open Workspace
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-blue-900 mb-4">
                Create or join a workspace to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}