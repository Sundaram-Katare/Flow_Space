import { useState } from "react";
import CreateWorkspace from "./CreateWorkspace";
import { Plus, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateWorkspaceCard() {
    const [openModal, setOpenModal] = useState(false);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className=" w-full bg-white border border-slate-100 rounded-[24px] p-8 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-2">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
            <Plus size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Create Workspace
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
            Build a new home for your team's collaboration and productivity.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8 border-t border-slate-50 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white">
                <img className="h-full" src="https://static.vecteezy.com/system/resources/thumbnails/024/558/279/small/business-woman-isolated-illustration-ai-generative-free-png.png" alt="" />
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white">
                <img className="h-full" src="https://static.vecteezy.com/system/resources/thumbnails/032/844/092/small/business-woman-portrait-isolated-on-white-transparent-background-ai-generated-ai-generated-png.png" alt="" />
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white">
                <img className="h-full" src="https://static.vecteezy.com/system/resources/thumbnails/056/415/814/small/handsome-young-man-portrait-studio-shot-grey-shirt-men-male-face-hair-model-adult-clean-style-black-png.png" alt="" />
              </div>
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Invite anyone
          </span>
        </div>

        <button 
          className="bg-slate-900 text-white text-sm px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-95"
          onClick={() => setOpenModal(true)} 
        >
          Build Now
        </button>

        {openModal && (
          <CreateWorkspace onClose={() => setOpenModal(false)} />
        )}
      </div>
    </motion.div>
  );
}