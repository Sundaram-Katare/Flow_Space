import { MessageCircle, CheckSquare, FileText, Users, Plus } from "lucide-react";

export default function WorkspaceSidebar() {
  return (
    <div className="w-64 bg-white border-r p-4 flex flex-col justify-between">

      {/* Top */}
      <div>
        {/* Workspace Name */}
        <h2 className="text-lg font-semibold mb-6">🚀 Byte Blaze</h2>

        {/* Navigation */}
        <div className="space-y-4">
          <SidebarItem icon={<MessageCircle size={18} />} text="Chats" />
          <SidebarItem icon={<CheckSquare size={18} />} text="Tasks" />
          <SidebarItem icon={<FileText size={18} />} text="Docs" />
          <SidebarItem icon={<Users size={18} />} text="Members" />
        </div>

        {/* Channels */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-2">CHANNELS</p>

          <ul className="space-y-2 text-sm">
            <li># general</li>
            <li># development</li>
            <li># random</li>
          </ul>

          <button className="flex items-center gap-1 mt-2 text-sm text-blue-600">
            <Plus size={14} /> Add Channel
          </button>
        </div>
      </div>

      {/* Bottom */}
      <button className="text-sm text-red-500">Logout</button>
    </div>
  );
}

function SidebarItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 hover:text-black cursor-pointer">
      {icon}
      <span>{text}</span>
    </div>
  );
}