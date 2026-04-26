import { Copy, Menu } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function WorkspaceTopbar({ onMenuClick }) {
  const { currentWorkspace } = useSelector(state => state.workspace);
  const { user } = useSelector(state => state.auth);
  
  const workspaceName = currentWorkspace?.name || "Workspace";
  const code = currentWorkspace?.workspace_code || "------";
  const userInitial = (user?.first_name?.charAt(0) || user?.username?.charAt(0) || "U").toUpperCase();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">

      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold truncate max-w-[150px] md:max-w-none">{workspaceName} / #general</h1>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="hidden sm:block border px-3 py-1 rounded-md w-40 md:w-80"
      />

      <div className="flex items-center gap-4">
        <div onClick={handleCopyCode} className="flex items-center gap-2 bg-gray-100 px-2 sm:px-3 py-1 rounded-md cursor-pointer hover:bg-gray-200 transition text-xs sm:text-sm">
          <span className="font-medium">{code}</span>
          <Copy size={14} className="sm:w-4 sm:h-4 w-3 h-3" />
        </div>
        <div className="w-8 h-8 bg-[#36C7B5] rounded-full ring-2 ring-emerald-50 text-white flex items-center justify-center font-bold">{userInitial}</div>
      </div>
    </div>
  );
}
