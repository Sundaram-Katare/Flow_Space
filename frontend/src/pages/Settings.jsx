import { useState, useEffect } from "react";
import { getCurrentUser } from "../services/userService.js";
import { User, Mail, Shield, Bell, Lock, Camera, Edit2, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUser();
        setProfile(data.user);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 bg-[#FDFDFD]">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium tracking-wide">Fetching your profile...</p>
      </div>
    );
  }

  const sections = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: Sparkles },
  ];

  return (
    <div className="h-full bg-[#FDFDFD] overflow-y-auto no-scrollbar">
      <div className="max-w-5xl mx-auto p-8 lg:p-12 space-y-12">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium">Manage your account settings and preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold transition-all ${
                    section.id === 'profile' 
                    ? 'bg-teal-600 text-white shadow-xl shadow-teal-200' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <section.icon size={20} />
                    <span>{section.label}</span>
                  </div>
                  {section.id !== 'profile' && <ChevronRight size={16} className="opacity-50" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Hero Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-teal-200">
                    {profile?.username?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-3 bg-white text-teal-600 rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-transform active:scale-95">
                    <Camera size={20} />
                  </button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : profile?.username}
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">@{profile?.username}</p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className="px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-teal-100">
                      Pro Member
                    </div>
                    <div className="px-4 py-2 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-100">
                      Admin
                    </div>
                  </div>
                </div>

                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-200 flex items-center gap-2">
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </motion.div>

            {/* Profile Details Form */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-10 shadow-sm space-y-10">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-widest">Update your details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    Username
                  </label>
                  <input 
                    type="text" 
                    readOnly 
                    value={profile?.username || ''} 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    readOnly 
                    value={profile?.email || ''} 
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold outline-none cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Edit2 size={16} className="text-slate-400" />
                    First Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Not set"
                    value={profile?.first_name || ''} 
                    className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Edit2 size={16} className="text-slate-400" />
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Not set"
                    value={profile?.last_name || ''} 
                    className="w-full px-6 py-4 bg-slate-100 border-none rounded-2xl text-slate-900 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-end">
                <button className="px-10 py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 shadow-xl shadow-teal-200/50 transition-all active:scale-95">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-[32px] p-8 lg:p-10 space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-rose-900">Danger Zone</h3>
                <p className="text-sm text-rose-600 font-medium">Permanently delete your account and all associated data.</p>
              </div>
              <button className="px-8 py-4 bg-white text-rose-600 border border-rose-200 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
