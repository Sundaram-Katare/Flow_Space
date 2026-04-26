import { GitBranch, GitCommit, GitCompare } from "lucide-react";

export default function Navbar() {
   return (
      <>
         <nav className="flex justify-between items-center py-4 text-black font-poppins">
            <div className="flex items-center text-4xl gap-0 space-x-0 font-bold">
               <img src="https://www.pngarts.com/files/2/Letter-F-Download-PNG-Image.png" className="h-12" alt="" />
               FlowSpace
            </div>

            <div className="flex justify-center space-x-8 text-xl font-semibold items-center">


               <button
                  onClick={() => window.open("https://github.com", "_blank")}
                  className="bg-red-500 flex text-md gap-2 items-center font-poppins cursor-pointer text-white rounded-full px-2 py-1">
                  GitHub <GitCompare size={20} />
               </button>
            </div>
         </nav>
      </>
   )
}