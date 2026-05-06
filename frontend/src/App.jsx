import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Recipe from "./pages/Recipe";
import Setting from "./pages/Setting";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";

function Layout() {
  const location = useLocation();

  // 숨길 경로
  const hideNav = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
      </div>

      {!hideNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}