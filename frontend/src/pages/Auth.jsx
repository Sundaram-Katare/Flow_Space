import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../../features/auth/authSlice.js";
import { Mail, Lock, User, Zap } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
      dispatch(signupUser(formData));
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_1fr]">
        {/* Left side - Image Placeholder */}
        <div className="hidden lg:flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-64 h-64 bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg">Image Placeholder</span>
            </div>
            <p className="text-gray-400 text-sm">Add your image here</p>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-14">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-md"
            >
              <p className="mb-3 text-sm font-medium text-gray-400">
                Fast, Secure & Reliable
              </p>

              <h2 className="text-4xl font-semibold tracking-tight text-[#111]">
                {isLogin ? "Login to WorkSpace" : "Create your WorkSpace"}
              </h2>

              <p className="mt-2 text-gray-500">
                {isLogin
                  ? "Start managing your task faster & better"
                  : "Create an account and start managing your tasks"}
              </p>

              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                {!isLogin && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#222]">
                      Full Name
                    </label>
                    <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 px-4">
                      <User size={18} className="text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#222]">
                    Enter your company email
                  </label>
                  <div className="flex h-14 items-center gap-3 rounded-xl border border-[#9acd66] px-4 shadow-[0_0_0_3px_rgba(154,205,102,0.08)]">
                    <Mail size={18} className="text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="abc@business.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#222]">
                    Password
                  </label>
                  <div className="flex h-14 items-center gap-3 rounded-xl border border-gray-200 px-4">
                    <Lock size={18} className="text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-14 w-full rounded-xl bg-black text-white font-medium transition hover:bg-neutral-800 disabled:opacity-70"
                >
                  {loading
                    ? "Loading..."
                    : isLogin
                    ? "Login to your account"
                    : "Create your account"}
                </button>
              </form>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              {isAuthenticated && (
                <p className="mt-4 text-sm text-green-600">
                  ✅ Logged in successfully
                </p>
              )}

              <div className="mt-10 border-t border-black/5 pt-6">
                <h3 className="text-2xl font-medium text-[#222]">
                  {isLogin
                    ? "Set up a Workspace for a business"
                    : "Already have a Workspace account?"}
                </h3>
                <p className="mt-2 text-gray-400">
                  {isLogin
                    ? "Dedicated workspace tailored to meet the operational needs"
                    : "Login and continue managing your team faster"}
                </p>

                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="mt-4 text-sm font-medium text-[#63a72f] hover:underline"
                >
                  {isLogin
                    ? "Don't have an account? Signup"
                    : "Already have an account? Login"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
  );
}