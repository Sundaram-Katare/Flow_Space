import { useState } from "react";
import CreateWorkspace from "./CreateWorkspace";

export default function CreateWorkspaceCard() {
    const [openModal, setOpenModal] = useState(false);


  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
            Create Your Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Organize your projects, collaborate with your team, and manage everything in one place.
          </p>
        </div>

        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 text-gray-700">
          +
        </div>
      
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="text-xs text-gray-400">
          Visible only to invited members
        </span>

        <button className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
                onClick={() => setOpenModal(true)} 
        >
          Create
        </button>

        {openModal && (
            <>
             <CreateWorkspace onClose={() => setOpenModal(false)} />
            </>
        )}
      </div>
    </div>
  );
}