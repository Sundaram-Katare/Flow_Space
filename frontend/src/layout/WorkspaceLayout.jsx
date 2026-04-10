import WorkspaceSidebar from "../components/Workspace/WorkspaceSidebar";
import WorkspaceTopbar from "../components/Workspace/WorkspaceTopbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function WorkspaceLayout() {
  const [open, setOpen] = useState(window.innerWidth > 768);

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      
      <WorkspaceSidebar open={open} setOpen={setOpen} />

      <div className="flex flex-col flex-1 min-w-0">
        
        <WorkspaceTopbar onMenuClick={() => setOpen(true)} />

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
}