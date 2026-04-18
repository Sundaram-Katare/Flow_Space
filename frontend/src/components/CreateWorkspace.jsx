// import { Plus, X } from "lucide-react";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createWorkspace } from "../../features/workspace/workspaceSlice";
// import toast from "react-hot-toast";

// export default function CreateWorkspace() {
//     const [openModal, setOpenModal] = useState(false);
//     const [workspaceName, setWorkspaceName] = useState("");
//     const dispatch = useDispatch();
//     const { loading } = useSelector((state) => state.workspace);

//     const handleCreate = async (e) => {
//         e.preventDefault();
//         if (!workspaceName.trim()) {
//             toast.error("Please enter a workspace name");
//             return;
//         }

//         const resultAction = await dispatch(createWorkspace({ name: workspaceName }));
//         if (createWorkspace.fulfilled.match(resultAction)) {
//             toast.success("Workspace created successfully!");
//             setWorkspaceName("");
//             setOpenModal(false);
//         } else {
//             toast.error(resultAction.payload || "Failed to create workspace");
//         }
//     };

//     return (
//         <>
//          <div className="bg-gray-200 h-full w-full flex flex-col space-y-2 justify-center items-center rounded-xl min-h-[160px]">
//             <div className="bg-gray-100 m-2 rounded-lg flex flex-col space-y-2 justify-center items-center p-6 hover:scale-[1.05] transition-all duration-300">
//               <Plus size={36}/>

//             <button 
//             onClick={() => setOpenModal(true)}
//             className="bg-black px-6 py-1 rounded-md text-white font-semibold text-xl font-poppins hover:scale-[1.05] transition-all duration-300 ">
//                 Create your Workspace
//             </button>
//             </div>
//          </div>

//          {/* Modal */}
//          {openModal && (
//              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//                  <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
//                      <button 
//                         onClick={() => setOpenModal(false)}
//                         className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors"
//                      >
//                          <X size={24} />
//                      </button>

//                      <h2 className="text-3xl font-bold font-poppins mb-2">Create Workspace</h2>
//                      <p className="text-gray-500 mb-8 font-poppins">Give your workspace a name to get started.</p>

//                      <form onSubmit={handleCreate} className="space-y-6">
//                          <div className="space-y-2">
//                              <label className="text-sm font-semibold text-gray-700 ml-1">Workspace Name</label>
//                              <input 
//                                 type="text"
//                                 placeholder="e.g. Acme Corp"
//                                 value={workspaceName}
//                                 onChange={(e) => setWorkspaceName(e.target.value)}
//                                 className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl px-6 outline-none transition-all font-poppins text-lg"
//                                 autoFocus
//                              />
//                          </div>

//                          <button 
//                             type="submit"
//                             disabled={loading}
//                             className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
//                          >
//                              {loading ? "Creating..." : "Create Workspace"}
//                          </button>
//                      </form>
//                  </div>
//              </div>
//          )}
//         </>
//     )
// }

import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createWorkspaceSuccess } from "../../features/workspace/workspaceSlice.js";
import { createWorkspace } from "../services/workspace.js";

export default function CreateWorkspace({ onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await createWorkspace(name, description);
      dispatch(createWorkspaceSuccess(data.workspace));
      toast.success("Workspace created successfully!");
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TechStartup"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}