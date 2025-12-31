import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart'; // 1. Import Cart
import RestaurantProfile from './pages/RestaurantProfile';
import { useAuth } from './context/AuthContext'; // 2. Import Auth Hook

function App() {
  const { user } = useAuth(); // 3. Get the current user status

  // Helper component to Protect Routes
  // It checks: Do we have a user? If yes, show the page. If no, go to Login.
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* --- LOCKED ROUTES (Require Login) --- */}
        
        {/* 1. Lock the Home Page */}
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        {/* 2. Lock the Dashboard (Partners only) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PartnerDashboard />
          </ProtectedRoute>
        } />

        {/* 3. Lock the Cart */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />

        {/* --- PUBLIC ROUTES (Anyone can see) --- */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />
        
        {/* --- OPEN ROUTES (Anyone can see) --- */}
        <Route path="/restaurant/:id" element={<RestaurantProfile />} />
      </Routes>
    </>
  );
}

export default App;