import { useEffect, useState } from 'react';
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
  const { user, login } = useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ NEW: State to block rendering while we process the token
  const [processingGoogle, setProcessingGoogle] = useState(false);

  // --- GOOGLE AUTH HANDLER ---
  useEffect(() => {
    const handleGoogleAuth = async () => {
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get("token");

      if (token) {
        // 1. BLOCK THE APP immediately
        setProcessingGoogle(true);
        
        try {
          localStorage.setItem("zomatoToken", token);
          
          // 2. Fetch User Profile
          const response = await getMyProfile();
          const userData = response.data;
          
          // 3. Save & Update State
          localStorage.setItem("zomatoUser", JSON.stringify(userData));
          if (login) login(userData); 

          // 4. CLEAN URL
          window.history.replaceState({}, document.title, "/");

          // 5. DECIDE & NAVIGATE
          if (userData.role === 'partner') {
             navigate('/dashboard', { replace: true });
          } else {
             navigate('/', { replace: true });
          }
          
        } catch (error) {
          console.error("Google Login Failed:", error);
          localStorage.removeItem("zomatoToken");
          navigate('/login');
        } finally {
          // 6. UNBLOCK THE APP
          setProcessingGoogle(false);
        }
      }
    };

    handleGoogleAuth();
  }, [location, navigate, login]);

  // --- LOADING SCREEN (The Gatekeeper) ---
  if (processingGoogle) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold">Logging you in...</h2>
        <p className="text-gray-400 text-sm">Please wait a moment.</p>
      </div>
    );
  }

  // --- PROTECTED ROUTE ---
  const ProtectedRoute = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    const activeUser = user || storedUser;
    if (!activeUser) return <Navigate to="/login" replace />;
    return children;
  };

  // --- PUBLIC ROUTE ---
  const PublicRoute = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
    const activeUser = user || storedUser;
    if (activeUser) {
      return <Navigate to={activeUser.role === 'partner' ? "/dashboard" : "/"} replace />;
    }
    return children;
  };

  // Get current user data
  const storedUser = JSON.parse(localStorage.getItem("zomatoUser"));
  const currentUser = user || storedUser;

  // 1. IF NOT LOGGED IN
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // 2. IF LOGGED IN
  return (
    <div className="flex bg-black min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-20 lg:ml-64 w-full relative"> 
        <Routes>
          
          {/* ✅ HOME ROUTE GUARD */}
          <Route path="/" element={
            <ProtectedRoute>
              {currentUser.role === 'partner' ? <Navigate to="/dashboard" replace /> : <Home />}
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/restaurant/:id" element={<RestaurantProfile />} />
          
          <Route path="*" element={<Navigate to={currentUser.role === 'partner' ? "/dashboard" : "/"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;