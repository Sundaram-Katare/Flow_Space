import { useState } from "react";
import {
  MessageCircle,
  CheckSquare,
  FileText,
  Users,
  Plus,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkspaceSidebar({ open, setOpen }) {
  const [channels] = useState(["general", "development", "random"]);

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
          bg-[#36C7B5] text-black
          fixed md:relative
          top-0 left-0 z-50
          h-screen
          ${open ? "w-64" : "w-20 -translate-x-full md:translate-x-0"}
          transition-all duration-300 ease-in-out shadow-xl overflow-y-auto no-scrollbar
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-10 bg-white text-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg border border-gray-100 z-[60] hover:scale-110 transition-transform"
        >
          {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>

        <div className={`p-6 flex items-center gap-3 transition-all duration-300 ${open ? "justify-start" : "justify-center"}`}>
          <div className="min-w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
            B
          </div>
          {open && (
            <span className="text-2xl font-bold font-poppins tracking-tight animate-in fade-in duration-500">
              Byte Blaze
            </span>
          )}
        </div>

        <nav className="mt-8 flex flex-col px-4 gap-2 h-[calc(100vh-120px)]">
          <SidebarItem open={open} icon={<MessageCircle size={22} />} text="Chats" />
          <SidebarItem open={open} icon={<CheckSquare size={22} />} text="Tasks" />
          <SidebarItem open={open} icon={<FileText size={22} />} text="Docs" />
          <SidebarItem open={open} icon={<Users size={22} />} text="Members" />

          {open && (
            <div className="mt-6 px-2 animate-in slide-in-from-left-2 duration-300">
              <p className="text-xs font-bold tracking-widest text-[#2a9d8f] mb-4 opacity-70">
                CHANNELS
              </p>

              <div className="flex flex-col gap-1 border-l-2 border-[#2a9d8f]/30 ml-2 py-1">
                {channels.map((channel) => (
                  <button
                    key={channel}
                    className="text-left p-2 pl-4 text-[15px] font-poppins text-gray-800 hover:text-black hover:bg-white/40 rounded-xl transition-all"
                  >
                    # {channel}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-2 mt-4 p-2 pl-4 text-sm font-poppins text-black/60 hover:text-black transition-colors font-medium">
                <Plus size={16} />
                Add Channel
              </button>
            </div>
          )}

          <div className="mt-auto">
            <button className={`flex items-center gap-4 p-3 hover:bg-white/40 rounded-2xl transition-all duration-group w-full ${!open && "justify-center"}`}>
              <LogOut size={22} className="text-red-600" />
              {open && (
                <span className="font-poppins text-lg font-bold text-red-600">
                  Logout
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

function SidebarItem({ icon, text, open }) {
  return (
    <button className={`flex items-center gap-4 p-3 hover:bg-white/40 rounded-2xl transition-all duration-200 group w-full ${!open && "justify-center"}`}>
      <span className="text-black/60 group-hover:text-black transition-colors">{icon}</span>
      {open && (
        <span className="font-poppins text-lg font-medium text-black group-hover:font-semibold">
          {text}
        </span>
      )}
    </button>
  );
}