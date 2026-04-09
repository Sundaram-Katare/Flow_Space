import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
    const [open, setOpen] = useState(true);

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar open={open} setOpen={setOpen} />

                <div className="flex-1 bg-gray-100 p-4">
                    <button
                        className="md:hidden mb-4"
                        onClick={() => setOpen(true)}
                    >
                        Open Menu
                    </button>
                    <Outlet />
                </div>
            </div>
        </>
    )
} 