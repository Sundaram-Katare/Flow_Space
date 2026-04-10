import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import WorkspaceLayout from "./layout/WorkspaceLayout";
import Workspace from "./pages/Workspace";


function App() {

  return (
    <>
      <div className="bg-[url('/homeBG.png')] no-repeat border-b border-4-black border-black">
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>

            <Route element={<WorkspaceLayout />}>
               <Route path="/workspace/:id" element={<Workspace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;
