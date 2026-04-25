import { useState } from "react";
import { Hash, X, Plus, Info, Layout, Lock, Globe } from "lucide-react";
import { createChannel } from "../../services/chat";
import toast from "react-hot-toast";

export default function CreateChannel({ workspaceId, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channelType, setChannelType] = useState("public");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const data = await createChannel(workspaceId, name.trim(), description.trim(), channelType);
      toast.success("Channel created successfully!");
      if (onSuccess) onSuccess(data.channel);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
          <Plus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create a channel</h2>
          <p className="text-sm text-slate-500 font-medium">Channels are where your team communicates.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Channel Name</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="e.g. marketing-plan"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-slate-400 font-normal text-xs">(optional)</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this channel about?"
            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-900 resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button
                type="button"
                onClick={() => setChannelType("public")}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    channelType === "public" 
                    ? "border-teal-500 bg-teal-50 text-teal-700 ring-4 ring-teal-500/5 shadow-sm" 
                    : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-500"
                }`}
            >
                <Globe size={20} />
                <span className="font-bold text-xs uppercase tracking-widest text-center">Public</span>
            </button>
            <button
                type="button"
                onClick={() => setChannelType("private")}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                    channelType === "private" 
                    ? "border-teal-500 bg-teal-50 text-teal-700 ring-4 ring-teal-500/5 shadow-sm" 
                    : "border-slate-100 bg-slate-50 hover:border-slate-200 text-slate-500"
                }`}
            >
                <Lock size={20} />
                <span className="font-bold text-xs uppercase tracking-widest text-center">Private</span>
            </button>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-xl shadow-teal-200 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              Create Channel
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
        <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-blue-600 font-medium leading-relaxed">
            Channels are where conversations happen. When private, only invited members can view the content.
        </p>
      </div>
    </div>
  );
}
