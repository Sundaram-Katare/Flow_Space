import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";


function App() {

  return (
    <>
      <div className="bg-[url('/homeBG.png')] no-repeat border-b border-4-black border-black">
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element= {<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App;
