
export default function Navbar() {
    return (
        <>
         <nav className="flex justify-between items-center py-4 text-black font-poppins">
            <div className="flex items-center text-4xl gap-0 space-x-0 font-bold">
               <img src="https://www.pngarts.com/files/2/Letter-F-Download-PNG-Image.png" className="h-12" alt="" />
               FlowSpace
            </div>

            <div className="flex justify-center space-x-8 text-xl font-semibold items-center">
               <h2>Features</h2>
               <h2>Tasks</h2>
               <h2>Integrations</h2>
               <h2>Signup</h2>

               <button className="bg-red-500 cursor-pointer text-white rounded px-2 py-1">
                Get Started
               </button>
            </div>
         </nav>
        </>
    )
}