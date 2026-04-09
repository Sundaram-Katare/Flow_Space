import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Auth from "./pages/Auth";


function App() {

  return (
    <>
      <div className="bg-[url('/homeBG.png')] no-repeat border-b border-4-black border-black">
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App;
