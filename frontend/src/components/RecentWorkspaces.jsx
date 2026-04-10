import { Clock, ExternalLink } from "lucide-react";

export default function RecentWorkspaces() {
    const recentWorkspaces = [
        { id: 1, name: "Design Team", lastUsed: "2h ago", color: "bg-purple-500" },
        { id: 2, name: "Product Roadmap", lastUsed: "5h ago", color: "bg-blue-500" },
        { id: 3, name: "Marketing Sync", lastUsed: "Yesterday", color: "bg-emerald-500" },
    ];

    return (
        <div className="bg-white/50 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-sm h-full font-poppins">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="text-gray-500" size={20} />
                <h2 className="text-xl font-semibold text-gray-800">Recent Workspaces</h2>
            </div>

            <div className="space-y-4">
                {recentWorkspaces.map((workspace) => (
                    <div 
                        key={workspace.id}
                        className="group flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 ${workspace.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                                {workspace.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-black">{workspace.name}</h3>
                                <p className="text-xs text-gray-500">Seen {workspace.lastUsed}</p>
                            </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
                    </div>
                ))}
            </div>
        </div>
    );
}