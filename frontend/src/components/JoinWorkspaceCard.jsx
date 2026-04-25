import { useState } from "react";
import JoinWorkspace from "./JoinWorkspace";
import { Hash, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function JoinWorkspaceCard() {
    const [openModal, setOpenModal] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="w-full bg-[#EEF2FF] border border-blue-100 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
            <Hash size={24} />
          </div>
          <h2 className="text-xl font-bold text-blue-900 tracking-tight">
            Join Workspace
          </h2>
          <p className="text-sm text-blue-500 leading-relaxed max-w-[280px]">
            Already have a team? Join using a unique invite code from your admin.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-blue-50 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center">
            <Sparkles size={12} className="text-blue-600" />
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">
            Secure entry
          </span>
        </div>

        <button 
          className="bg-blue-600 text-white text-sm px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          onClick={() => setOpenModal(true)}
        >
          Enter Space
        </button>
      </div>

      {openModal && (
        <JoinWorkspace onClose={() => setOpenModal(false)}/>
      )}
    </motion.div>
  );
}