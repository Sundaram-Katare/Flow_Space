import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import WorkspaceLayout from "./layout/WorkspaceLayout";
import Workspace from "./pages/Workspace";
import { getCurrentUser } from "./services/auth.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../features/auth/authSlice.js";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

    useEffect(() => {
    if (token) {
      const loadUser = async () => {
        try {
          const user = await getCurrentUser();
          dispatch(setUser(user));
        } catch (err) {
          console.error("Failed to load user:", err);
        }
      };
      loadUser();
    }
  }, [token, dispatch]);

  return (
    <>
      <div className=" bg-gradient-to-b from-white to-[#26917F] no-repeat border-b border-4-black border-black">
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>

            <Route path="/workspace/:id" element={<WorkspaceLayout />}>
               <Route index element={<Workspace />} />
               <Route path="chat/:channelId" element={<Workspace />} />
               <Route path="tasks" element={<Workspace />} />
               <Route path="docs" element={<Workspace />} />
            </Route>

            {/* Fallback for old/wrong routes */}
            <Route path="/chat/:channelId" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App;
