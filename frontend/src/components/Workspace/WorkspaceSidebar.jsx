import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../features/auth/authSlice";
import { clearWorkspaces } from "../../../features/workspace/workspaceSlice";
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

export default function WorkspaceSidebar({ open, setOpen }) {
  const [channels] = useState(["general", "development", "random"]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWorkspaces());
    navigate("/auth");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-screen bg-[#36C7B5] text-black shadow-xl overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out md:relative ${
          open ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-10 z-[60] flex h-8 w-8 items-center justify-center rounded-full border border-gray-100 bg-white text-black shadow-lg transition-transform hover:scale-110"
        >
          {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
        </button>

        <div
          className={`flex items-center gap-3 p-6 transition-all duration-300 ${
            open ? "justify-start" : "justify-center"
          }`}
        >
          <div className="min-w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xl font-bold shadow-lg">
            B
          </div>

          {open && (
            <span className="text-2xl font-bold tracking-tight font-poppins animate-in fade-in duration-500">
              Byte Blaze
            </span>
          )}
        </div>

        <nav className="mt-8 flex h-[calc(100vh-120px)] flex-col gap-2 px-4">
          <SidebarItem
            open={open}
            icon={<MessageCircle size={22} />}
            text="Chats"
          />
          <SidebarItem
            open={open}
            icon={<CheckSquare size={22} />}
            text="Tasks"
          />
          <SidebarItem
            open={open}
            icon={<FileText size={22} />}
            text="Docs"
          />
          <SidebarItem
            open={open}
            icon={<Users size={22} />}
            text="Members"
          />

          {open && (
            <div className="mt-6 animate-in slide-in-from-left-2 px-2 duration-300">
              <p className="mb-4 text-xs font-bold tracking-widest text-[#2a9d8f] opacity-70">
                CHANNELS
              </p>

              <div className="ml-2 flex flex-col gap-1 border-l-2 border-[#2a9d8f]/30 py-1">
                {channels.map((channel) => (
                  <button
                    key={channel}
                    className="rounded-xl p-2 pl-4 text-left text-[15px] font-poppins text-gray-800 transition-all hover:bg-white/40 hover:text-black"
                  >
                    # {channel}
                  </button>
                ))}
              </div>

              <button className="mt-4 flex items-center gap-2 p-2 pl-4 text-sm font-medium font-poppins text-black/60 transition-colors hover:text-black">
                <Plus size={16} />
                Add Channel
              </button>
            </div>
          )}

          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className={`flex w-full items-center gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-white/40 ${
                !open ? "justify-center" : ""
              }`}
            >
              <LogOut size={22} className="text-red-600" />
              {open && (
                <span className="text-lg font-bold font-poppins text-red-600">
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
    <button
      className={`flex w-full items-center gap-4 rounded-2xl p-3 transition-all duration-200 hover:bg-white/40 group ${
        !open ? "justify-center" : ""
      }`}
    >
      <span className="text-black/60 transition-colors group-hover:text-black">
        {icon}
      </span>

      {open && (
        <span className="text-lg font-medium font-poppins text-black group-hover:font-semibold">
          {text}
        </span>
      )}
    </button>
  );
}