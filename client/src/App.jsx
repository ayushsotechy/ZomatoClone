import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart';
import RestaurantProfile from './pages/RestaurantProfile';
import { useAuth } from './context/AuthContext';
import { jwtDecode } from "jwt-decode"; // Optional: If you want real data
import { getMyProfile } from './api/auth';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // --- GOOGLE AUTH HANDLER ---
  useEffect(() => {
    // We define an async function inside useEffect to handle the API call
    const completeGoogleLogin = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (token) {
        try {
          // 1. Save Token
          localStorage.setItem("zomatoToken", token);
          
          // 2. FETCH REAL USER PROFILE (Replaces dummyUser)
          const response = await getMyProfile();
          
          // 3. Save the REAL user data to localStorage
          // response.data usually contains the user object
          localStorage.setItem("zomatoUser", JSON.stringify(response.data));

          // 4. Clean URL
          window.history.replaceState({}, document.title, "/");

          // 5. Force Reload to apply changes and update Auth State
          window.location.reload();
          
        } catch (error) {
          console.error("Google Login Failed:", error);
          // Optional: If fetching profile fails, clear token so they try again
          localStorage.removeItem("zomatoToken");
        }
      }
    };

    completeGoogleLogin();
  }, [location]);

  // ... (Rest of your ProtectedRoute / PublicRoute logic remains the same)

  const ProtectedRoute = ({ children }) => {
    // Now 'user' will be found in localStorage, so this won't block you!
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    if (!user && !storedUser) return <Navigate to="/login" replace />;
    return children;
  };

  const PublicRoute = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    if (user || storedUser) return <Navigate to="/" replace />;
    return children;
  };

  // IF NOT LOGGED IN
  // Check localStorage directly to prevent flashing Login page on refresh
  const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));

  if (!user && !storedUser) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // IF LOGGED IN
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-20 lg:ml-64 w-full relative"> 
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/restaurant/:id" element={<RestaurantProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;