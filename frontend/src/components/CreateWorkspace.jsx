import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateWorkspace({ modalOpen }) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
         <div className="bg-gray-200 h-40 w-[400px] flex flex-col space-y-2 justify-center items-center rounded-xl">
            <div className="bg-gray-100 m-2 rounded-lg flex flex-col space-y-2 justify-center items-center p-6 hover:scale-[1.05] transition-all duration-300">
              <Plus size={36}/>

            <button 
            onClick={() => setOpenModal(true)}
            className="bg-black px-6 py-1 rounded-md text-white font-semibold text-xl font-inter hover:scale-[1.05] transition-all duration-300 ">
                Create your Workspace
            </button>
            </div>
         </div>
        </>
    )
}