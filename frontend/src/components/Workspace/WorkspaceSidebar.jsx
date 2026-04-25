import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link, useParams } from "react-router-dom";
import { logout } from "../../../features/auth/authSlice";
import { clearWorkspaces } from "../../../features/workspace/workspaceSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  CheckSquare,
  FileText,
  Users,
  Plus,
  LogOut,
  ChevronLeft,
  Menu,
  LayoutDashboard,
  ChevronDown,
  Hash,
  Settings,
} from "lucide-react";

export default function WorkspaceSidebar({ 
  open, 
  setOpen, 
  activeItem, 
  setActiveItem, 
  activeChannel, 
  setActiveChannel,
  channels,
  members,
  loading
}) {
  const { id: workspaceId } = useParams();
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWorkspaces());
    navigate("/auth");
  };

  const navItems = [
    { id: "chats", icon: <MessageCircle size={20} />, text: "Chats" },
    { id: "tasks", icon: <CheckSquare size={20} />, text: "Tasks" },
    { id: "docs", icon: <FileText size={20} />, text: "Docs" },
  ];

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ width: open ? 280 : 80 }}
        className={`fixed top-0 left-0 z-50 h-screen bg-[#F8FAFC] border-r border-gray-200 text-slate-900 shadow-2xl flex flex-col transition-all duration-300 ease-in-out md:relative ${
          !open ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-4 top-10 z-[60] flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-md transition-all hover:text-teal-600 hover:scale-110"
        >
          {open ? <ChevronLeft size={16} /> : <Menu size={16} />}
        </button>

        <div className="p-6 mb-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 group px-2 py-1 rounded-xl transition-all hover:bg-teal-50 ${
              !open ? "justify-center" : ""
            }`}
          >
            <div className="min-w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-200 group-hover:scale-105 transition-transform">
              F
            </div>
            {open && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight font-poppins text-slate-900 leading-tight text-nowrap truncate max-w-[150px]">
                  FlowSpace
                </span>
                <span className="text-xs font-medium text-slate-400">Workspace</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-100 ${
              !open ? "justify-center" : ""
            }`}
          >
            <LayoutDashboard size={20} className="text-slate-400 group-hover:text-teal-600" />
            {open && (
              <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900">
                Dashboard
              </span>
            )}
          </Link>

          <div className="my-4 border-t border-slate-100" />

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item.id);
                setActiveChannel(null);
                if (window.innerWidth < 768) setOpen(false);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                activeItem === item.id && !activeChannel ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-100"
              } ${!open ? "justify-center" : ""}`}
            >
              <span className={`${activeItem === item.id  && !activeChannel ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                {item.icon}
              </span>
              {open && <span className="text-sm font-semibold">{item.text}</span>}
              {activeItem === item.id && !activeChannel && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute left-0 w-1 h-6 bg-teal-600 rounded-r-full"
                />
              )}
            </button>
          ))}

          {/* Channels Section */}
          <div className="mt-6 px-2">
            <button
              onClick={() => open && setIsChannelsOpen(!isChannelsOpen)}
              className={`flex w-full items-center justify-between py-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600 ${
                !open ? "justify-center" : ""
              }`}
            >
              {open ? (
                <>
                  <span>Channels</span>
                  <motion.span animate={{ rotate: isChannelsOpen ? 0 : -90 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </>
              ) : (
                <Hash size={18} />
              )}
            </button>

            <AnimatePresence>
              {open && isChannelsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2 flex flex-col gap-1 ml-1"
                >
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setActiveChannel(channel.id);
                        if (window.innerWidth < 768) setOpen(false);
                      }}
                      className={`group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        activeChannel === channel.id
                          ? "bg-slate-200 text-slate-900 shadow-sm"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      }`}
                    >
                      <Hash size={14} className={activeChannel === channel.id ? "text-teal-600" : "text-slate-300 group-hover:text-slate-400"} />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  ))}
                  <button 
                    onClick={() => {
                      setActiveChannel(null);
                      setActiveItem("create-channel");
                    }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Channel</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Members Section */}
          <div className="mt-4 px-2">
             <button
              onClick={() => open && setIsMembersOpen(!isMembersOpen)}
              className={`flex w-full items-center justify-between py-2 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-600 ${
                !open ? "justify-center" : ""
              }`}
            >
              {open ? (
                <>
                  <span>Members ({members.length})</span>
                  <motion.span animate={{ rotate: isMembersOpen ? 0 : -90 }}>
                    <ChevronDown size={14} />
                  </motion.span>
                </>
              ) : (
                <Users size={18} />
              )}
            </button>

            <AnimatePresence>
              {open && isMembersOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2 flex flex-col gap-1 ml-1"
                >
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-all cursor-default"
                    >
                      <div className="w-5 h-5 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center text-[8px] font-bold">
                        {String(member.user_id).charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{member.user_id}</span>
                      {member.role === 'admin' && (
                        <span className="text-[8px] px-1 bg-teal-50 text-teal-600 border border-teal-100 rounded">Admin</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all ${
              !open ? "justify-center" : ""
            }`}
          >
            <Settings size={20} className="text-slate-400" />
            {open && <span className="text-sm font-semibold">Settings</span>}
          </button>
          
          <button
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all mt-1 ${
              !open ? "justify-center" : ""
            }`}
          >
            <LogOut size={20} className="text-red-500" />
            {open && <span className="text-sm font-semibold">Log out</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
}