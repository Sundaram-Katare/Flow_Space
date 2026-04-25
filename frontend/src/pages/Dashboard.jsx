import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CreateWorkspaceCard from "../components/CreateWorkspaceCard";
import JoinWorkspaceCard from "../components/JoinWorkspaceCard";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/auth");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-full bg-[#FDFDFD] p-6 lg:p-12 space-y-12 overflow-y-auto no-scrollbar">
      {/* Navbar/Header */}
      <header className="flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium">Welcome back, {user?.name || "User"}!</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-bold text-sm shadow-sm border border-teal-100">
          <Sparkles size={16} />
          <span>Pro Plan</span>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-teal-200/50 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <h2 className="text-white font-extrabold text-4xl md:text-5xl leading-tight">
              Stay in sync. <br />
              <span className="text-teal-200">Get things done.</span>
            </h2>
            <p className="text-teal-50 font-medium text-lg max-w-md opacity-90">
              Everything your team needs — chats, tasks, and knowledge in one place. Streamline your workflow today.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="px-8 py-4 bg-white text-teal-700 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-2">
                Get Started <ArrowRight size={18} />
              </button>
              <button className="px-8 py-4 bg-teal-800/30 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-teal-800/40 transition-all text-sm">
                Explore Features
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-end">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-3xl scale-150 animate-pulse"></div>
              <img 
                src="/main1.png" 
                alt="Workspace Illustration" 
                className="h-80 w-auto relative z-10 drop-shadow-2xl" 
                onError={(e) => { e.target.src = "https://illustrations.popsy.co/teal/working-at-home.svg" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CreateWorkspaceCard />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <JoinWorkspaceCard />
        </motion.div>
      </div>
    </div>
  );
}