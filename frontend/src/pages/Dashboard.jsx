import { motion } from "framer-motion";
import { Workflow } from "lucide-react";
import { useState } from "react";
import CreateWorkspace from "../components/CreateWorkspace";
import RecentWorkspaces from "../components/RecentWorkspaces";

export default function Dashboard() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="space-y-20 px-12 py-12">
                <nav className="flex justify-end">
                    <h1 className="font-poppins text-2xl font-semibold text-black">FlowSpace</h1>
                </nav>

                <div className="bg-[#36C7B5] h-60 rounded-2xl p-6 grid grid-cols-2 gap-20">

                    <div className="flex flex-col space-y-6">
                        <h1 className="text-white font-poppins font-normal text-4xl">Stay in sync. Get things done.</h1>
                        <p className="text-white font-poppins font-light text-md">Everything your team needs — chats, tasks, and knowledge in one place.</p>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 z-10 flex items-end justify-end">
                            <img src="/main1.png" alt="" className="h-80" />
                        </div>
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[400px_1fr] justify-between gap-10 items-stretch">
                  <CreateWorkspace />
                  <RecentWorkspaces />
                </div>

            </div>
        </>
    )
} 