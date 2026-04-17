import { useState } from "react";
import JoinWorkspace from "./JoinWorkspace";

export default function JoinWorkspaceCard() {
    const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full max-w-md bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-red-600 tracking-tight">
            Join with a Code
          </h2>
          <p className="text-sm text-red-400 mt-1 leading-relaxed">
            Enter a workspace invite code to instantly join your team and start collaborating.
          </p>
        </div>

        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-100 text-red-600">
          #
        </div>
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="text-xs text-red-400">
          Ask your admin for the invite code
        </span>

        <button className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                onClick={() => setOpenModal(true)}
        >
          Join
        </button>
      </div>
      {
        openModal && (
            <>
             <JoinWorkspace onClose={() => setOpenModal(false)}/>
            </>
        )
      }
    </div>
  );
}