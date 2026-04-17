import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice.js";
import { fetchWorkspacesSuccess } from "../../features/workspace/workspaceSlice.js";
import { ChevronDown, ChevronRight, LayoutDashboard, Settings, Briefcase, Menu, X, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
    const dispatch = useDispatch();
    const { workspaces } = useSelector((state) => state.workspace);
    // const { token } = useSelector((state) => state.auth);
    // const { logout } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchWorkspacesSuccess());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/auth");
    };

    return (
        <div
            className={`
    bg-gray-200 text-black
    fixed md:static
    top-0 left-0 z-50
    min-h-screen
    ${open ? "w-64" : "w-16"}
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    transition-all duration-300 shadow-xl
  `}
        >
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-5 bg-white text-black px-2 py-1 rounded shadow-md border border-gray-100"
            >
                {open ? "◀" : "▶"}
            </button>

            <div className="p-6 text-2xl font-bold font-poppins flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white text-sm">F</div>
                {open && <span>FlowSpace</span>}
            </div>

            <nav className="mt-5 flex flex-col px-3 gap-1">
                <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-all duration-200 group">
                    <LayoutDashboard size={20} className="text-gray-500 group-hover:text-black" />
                    {open && <span className="font-poppins text-lg font-medium text-gray-700 group-hover:text-black">Dashboard</span>}
                </Link>

                <div className="flex flex-col">
                    <button
                        onClick={() => open && setIsWorkspaceOpen(!isWorkspaceOpen)}
                        className="flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all duration-200 group w-full"
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase size={20} className="text-gray-500 group-hover:text-black" />
                            {open && <span className="font-poppins text-lg font-medium text-gray-700 group-hover:text-black">My Workspaces</span>}
                        </div>
                        {open && (isWorkspaceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                    </button>

                    {open && isWorkspaceOpen && (
                        <div className="flex flex-col ml-9 mt-1 gap-1 border-l-2 border-gray-300">
                            {
                                workspaces.length > 0 ? (
                                   <>
                                     {
                                        workspaces.map((w) => (
                                            <Link
                                                key={w.id}
                                                to={`/workspaces/${w.id}`}
                                                className="p-2 pl-4 text-sm font-poppins text-gray-600 hover:text-black hover:bg-white rounded-lg transition-all"
                                            >
                                                {w.name}
                                            </Link>
                                        ))
                                    }
                                   </>
                                ) : (
                                    <div className="p-2 pl-4 text-sm font-poppins text-gray-400 italic">
                                        No workspaces yet
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>

                <Link to="/settings" className="flex items-center gap-3 p-3 hover:bg-white rounded-xl transition-all duration-200 group mt-auto">
                    <Settings size={20} className="text-gray-500 group-hover:text-black" />
                    {open && <span className="font-poppins text-lg font-medium text-gray-700 group-hover:text-black">Settings</span>}
                </Link>
            </nav>

            <div className="p-3 mt-5 hover:bg-white rounded-xl transition-all duration-200 group cursor-pointer"
                onClick={handleLogout}
            >
                Logout
            </div>
        </div>
    );
}
