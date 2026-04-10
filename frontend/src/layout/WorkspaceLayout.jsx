import WorkspaceSidebar from "../components/Workspace/WorkspaceSidebar";
import WorkspaceTopbar from "../components/Workspace/WorkspaceTopbar";

import { Outlet } from "react-router-dom";

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      
      <WorkspaceSidebar />

      <div className="flex flex-col flex-1">
        
        <WorkspaceTopbar />

        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}