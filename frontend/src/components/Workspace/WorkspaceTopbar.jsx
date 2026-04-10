import { Copy } from "lucide-react";

export default function WorkspaceTopbar() {
  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">

      {/* Left */}
      <h1 className="text-lg font-semibold">Byte Blaze / #general</h1>

      {/* Center */}
      <input
        type="text"
        placeholder="Search messages, tasks, docs..."
        className="border px-3 py-1 rounded-md w-80"
      />

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Invite Box */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
          <span className="text-sm font-medium">INV-3K9X2A</span>
          <Copy size={16} className="cursor-pointer" />
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>

      </div>
    </div>
  );
}