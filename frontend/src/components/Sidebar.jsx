import { LayoutDashboard, LayoutDashboardIcon, Settings, SettingsIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
    return (
        <div
            className={`
    bg-gray-200 text-black
    fixed md:static
    top-0 left-0 z-50
    min-h-screen
    ${open ? "w-64" : "w-8"}
    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    transition-all duration-300
  `}
        >
            <button
                onClick={() => setOpen(!open)}
                className="absolute -right-3 top-5 bg-white text-black px-2 py-1 rounded"
            >
                ☰
            </button>

            <div className="p-4 text-xl font-bold">
                {open ? "Dashboard" : "D"}
            </div>

            <nav className="mt-5 flex flex-col gap-2 justify-center items-center">
                <Link to="/" className="p-3 hover:bg-gray-800 rounded">
                    
                    {open ? (<><button className="flex justify-between text-black font-inter text-xl font-semibold items-center"><LayoutDashboard size={20}/> Dashboard </button></>) : (<LayoutDashboardIcon />)}
                </Link>
                <Link>
                
                </Link>
                <Link to="/settings" className="p-3 hover:bg-gray-800 rounded">
                    {open ? (<><button className="flex justify-between text-black font-inter text-xl font-semibold items-center"><Settings size={20}/> Settings </button></>) : (<SettingsIcon />)}
                </Link>
            </nav>
        </div>
    );
}