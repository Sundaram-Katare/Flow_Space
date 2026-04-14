import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../../features/auth/authSlice.js";
import { Mail, Lock, User, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await dispatch(loginUser(formData));
      navigate("/dashboard");
    } else {
      await dispatch(signupUser(formData));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex flex-col lg:flex-row font-sans selection:bg-[#45d1b3]/30 overflow-x-hidden">
      {/* Left side - Branded Banner section */}
      <div className="w-full lg:w-[45%] xl:w-[40%] p-4 lg:p-8 flex flex-col h-auto lg:h-screen">
        <div className="flex-1 bg-[#45d1b3] rounded-[2.5rem] p-8 lg:p-12 flex flex-col relative overflow-hidden shadow-2xl shadow-[#45d1b3]/20">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-[#45d1b3] rounded-[2px] rotate-45" />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">FlowSpace</span>
          </div>

          <div className="relative z-10 max-w-md">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
            >
              Stay in sync. <br />
              Get things done.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg lg:text-xl font-medium leading-relaxed"
            >
              Everything your team needs — chats, tasks, and knowledge in one place.
            </motion.p>
          </div>

          {/* Abstract Illustration Elements */}
          <div className="absolute bottom-0 right-0 w-full h-1/2 lg:h-3/5 overflow-hidden pointer-events-none">
            <svg
              viewBox="0 0 400 300"
              className="absolute bottom-[-10%] right-[-10%] w-[120%] h-auto opacity-40 mix-blend-overlay"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="300" r="200" fill="white" fillOpacity="0.2" />
              <circle cx="350" cy="150" r="100" fill="white" fillOpacity="0.1" />
              <rect x="50" y="200" width="100" height="100" rx="20" transform="rotate(15 50 200)" fill="white" fillOpacity="0.1" />
            </svg>
            
            {/* Visual placeholder for the "illustration" in the image using glassmorphism cards */}
            <div className="absolute bottom-12 right-12 flex flex-col items-end gap-4">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-400" />
                  <div className="h-2 w-20 bg-white/40 rounded" />
                </div>
                <div className="h-2 w-full bg-white/20 rounded mb-1" />
                <div className="h-2 w-2/3 bg-white/20 rounded" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl max-w-[220px] translate-x-[-20%]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-400" />
                  <div className="h-2 w-24 bg-white/40 rounded" />
                </div>
                <div className="h-2 w-full bg-white/20 rounded mb-1" />
                <div className="h-2 w-1/2 bg-white/20 rounded" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form section */}
      <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col items-center justify-center p-6 lg:p-12 min-h-screen">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#45d1b3]/10 text-[#45d1b3] text-xs font-bold uppercase tracking-wider mb-6">
              Welcome to FlowSpace
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#1a1a1a] tracking-tight mb-2">
              {isLogin ? "Sign in to account" : "Create new account"}
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              {isLogin 
                ? "Start managing your projects efficiently today." 
                : "Join thousands of teams collaborating on FlowSpace."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#45d1b3] transition-colors" size={20} />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#45d1b3] focus:ring-4 focus:ring-[#45d1b3]/5 transition-all placeholder:text-gray-400 font-medium"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#45d1b3] transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#45d1b3] focus:ring-4 focus:ring-[#45d1b3]/5 transition-all placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Password</label>
                  {isLogin && (
                    <button type="button" className="text-xs font-bold text-[#45d1b3] hover:underline">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#45d1b3] transition-colors" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-[#45d1b3] focus:ring-4 focus:ring-[#45d1b3]/5 transition-all placeholder:text-gray-400 font-medium"
                    required
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#1a1a1a] hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? "Sign In" : "Get Started"}</span>
                    {!isLogin && <CheckCircle2 size={18} />}
                  </>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {isAuthenticated && (
              <div className="mt-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Successfully authenticated! Redirecting...
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 font-medium text-base">
                {isLogin ? "New to FlowSpace?" : "Already joined us?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-[#45d1b3] font-bold hover:underline"
                >
                  {isLogin ? "Create an account" : "Sign in to account"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}