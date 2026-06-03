import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Recipe from "./pages/Recipe";
import Setting from "./pages/Setting";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Fridge from "./pages/Fridge";
import ProtectedRoute from "./routes/ProctectRoute";
import MySetting from "./components/MySetting";
import NotificationSetting from "./components/NotificationSetting";
import PrivacyPolicy from "./components/PrivacyPolicy";

function Layout() {

  const location = useLocation();

  // nav 숨김
  const hideNav = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      <div className="bg-gray-100 min-h-screen">

        <Routes>

          {/* 공개 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 보호 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fridge"
            element={
              <ProtectedRoute>
                <Fridge />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recipe"
            element={
              <ProtectedRoute>
                <Recipe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />

          <Route 
          path="/setting/my" 
          element={
              <ProtectedRoute>
                <MySetting />
              </ProtectedRoute>
            } 
          />

          <Route 
          path="/setting/notification" 
          element={
              <ProtectedRoute>
                <NotificationSetting />
              </ProtectedRoute>
            } 
          />

          <Route 
          path="/setting/privacy"
          element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            } 
          />

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