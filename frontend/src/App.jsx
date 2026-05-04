import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";
import Recipe from "./pages/Recipe";
import Setting from "./pages/Setting";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </div>

      <BottomNav />
    </BrowserRouter>
  );
}
