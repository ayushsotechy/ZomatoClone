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
import { getMyProfile } from './api/auth';
import MyOrders from './pages/MyOrders';
function App() {
  const { user, login } = useAuth(); // Make sure to destructure 'login' if needed for state updates
  const location = useLocation();
  const navigate = useNavigate();

  // --- GOOGLE AUTH HANDLER (THE FIX) ---
  useEffect(() => {
    const completeGoogleLogin = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (token) {
        try {
          // 1. SAVE THE TOKEN (Critical Step for 401 Error)
          localStorage.setItem("zomatoToken", token);
          
          // 2. Fetch the user profile using that token
          const response = await getMyProfile();
          
          // 3. Save User Data
          localStorage.setItem("zomatoUser", JSON.stringify(response.data));
          
          // 4. Update Context (Optional but good for immediate UI update)
          // login(response.data); 

          // 5. Clean the URL (remove ?token=...)
          window.history.replaceState({}, document.title, "/");

          // 6. Reload to ensure all states (Sidebar, Axios) pick up the new token
          window.location.reload();
          
        } catch (error) {
          console.error("Google Login Failed:", error);
          // If it fails, clear the bad token
          localStorage.removeItem("zomatoToken");
          navigate('/login');
        }
      }
    };

    completeGoogleLogin();
  }, [location, navigate]);

  // --- PROTECTED ROUTE ---
  const ProtectedRoute = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    if (!user && !storedUser) return <Navigate to="/login" replace />;
    return children;
  };

  // --- PUBLIC ROUTE ---
  const PublicRoute = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    const currentUser = user || storedUser;

    if (currentUser) {
      return <Navigate to={currentUser.role === 'partner' ? "/dashboard" : "/"} replace />;
    }
    return children;
  };

  const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
  const currentUser = user || storedUser;

  // 1. IF NOT LOGGED IN
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 2. IF LOGGED IN
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-20 lg:ml-64 w-full relative"> 
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/restaurant/:id" element={<RestaurantProfile />} />
          <Route path="*" element={<Navigate to={currentUser.role === 'partner' ? "/dashboard" : "/"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;