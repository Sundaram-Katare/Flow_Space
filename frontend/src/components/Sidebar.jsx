import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import { fetchWorkspacesSuccess } from "../../features/workspace/workspaceSlice.js";
import { 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  LogOut, 
  ChevronLeft, 
  Menu,
  Box,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUserWorkspaces } from "../services/workspace.js";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ open, setOpen }) {
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(true);
    const dispatch = useDispatch();
    const { workspaces } = useSelector((state) => state.workspace);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const data = await getUserWorkspaces();
                dispatch(fetchWorkspacesSuccess(data.workspaces || []));
            } catch (error) {
                console.error('Failed to fetch workspaces:', error);
                dispatch(fetchWorkspacesSuccess([]));
            }
        };
        fetchWorkspaces();
    }, [dispatch]);

    const handleWorkspaceClick = (workspaceId) => {
        window.open(`/workspace/${workspaceId}`, '_blank');
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth");
    };

    return (
        <motion.div
            animate={{ width: open ? 280 : 80 }}
            className={`
                bg-[#F8FAFC] border-r border-gray-200 text-slate-900
                fixed md:static min-h-screen flex flex-col
                top-0 left-0 z-50
                ${!open ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
                transition-all duration-300 shadow-2xl
            `}
        >
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-4 top-10 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-600 shadow-md transition-all hover:text-teal-600 hover:scale-110 z-50"
            >
                {open ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>

            <div className="p-6 mb-2">
                <div className={`flex items-center gap-3 ${!open ? "justify-center" : ""}`}>
                    <div className="min-w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-200">
                        F
                    </div>
                    {open && (
                        <div className="flex flex-col">
                            <Link to="/" className="text-lg font-bold tracking-tight font-poppins text-slate-900 leading-tight">
                                FlowSpace
                            </Link>
                            <span className="text-xs font-medium text-slate-400">Platform</span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto no-scrollbar px-4 space-y-1">
                <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-100 ${!open ? "justify-center" : ""}`}>
                    <LayoutDashboard size={20} className="text-slate-400 group-hover:text-teal-600" />
                    {open && <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Dashboard</span>}
                </Link>

                <div className="my-4 border-t border-slate-100" />

                <div className="flex flex-col">
                    <button
                        onClick={() => open && setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-100 ${!open ? "justify-center" : ""}`}
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase size={20} className="text-slate-400 group-hover:text-teal-600" />
                            {open && <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Workspaces</span>}
                        </div>
                        {open && (
                            <motion.span animate={{ rotate: isWorkspaceOpen ? 0 : -90 }}>
                                <ChevronDown size={14} className="text-slate-400" />
                            </motion.span>
                        )}
                    </button>

                    <AnimatePresence>
                        {open && isWorkspaceOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-1 flex flex-col gap-1 ml-4 border-l-2 border-slate-400"
                            >
                                {workspaces.length > 0 ? (
                                    workspaces.map((w) => (
                                        <button
                                            key={w.id}
                                            onClick={() => handleWorkspaceClick(w.id)}
                                            className="group flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition-all"
                                        >
                                            <Box size={14} className="text-slate-900 group-hover:text-teal-400" />
                                            <span className="truncate text-slate-900">{w.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-xs text-slate-400 italic font-medium">
                                        No workspaces yet
                                    </div>
                                )}
                                {/* <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-teal-600 hover:bg-teal-50 transition-colors uppercase tracking-widest mt-2">
                                    <Plus size={14} />
                                    <span>Create New</span>
                                </button> */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            <div className="p-4 bg-slate-50 border-t border-slate-200">
                <Link to="/dashboard/settings" className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all ${!open ? "justify-center" : ""}`}>
                    <Settings size={20} className="text-slate-400" />
                    {open && <span className="text-sm font-semibold">Settings</span>}
                </Link>
                
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-700 transition-all mt-1 ${!open ? "justify-center" : ""}`}
                >
                    <LogOut size={20} className="text-red-500" />
                    {open && <span className="text-sm font-semibold">Log out</span>}
                </button>
            </div>
        </motion.div>
    );
}
