import { Copy, Menu } from "lucide-react";

export default function WorkspaceTopbar({ onMenuClick }) {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">

      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-semibold truncate max-w-[150px] md:max-w-none">Byte Blaze / #general</h1>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="hidden sm:block border px-3 py-1 rounded-md w-40 md:w-80"
      />

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
          <span className="text-sm font-medium">INV-3K9X2A</span>
          <Copy size={16} className="cursor-pointer" />
        </div>
        <div className="w-8 h-8 bg-[#36C7B5] rounded-full ring-2 ring-emerald-50 text-white flex items-center justify-center font-bold">U</div>
      </div>
    </div>
  );
}