import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";


function App() {

  return (
    <>
      <div className="bg-[url('/homeBG.png')]">
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App;
