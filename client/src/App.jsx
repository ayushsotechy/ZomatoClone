import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // <--- Import New Sidebar
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart';
import RestaurantProfile from './pages/RestaurantProfile';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) return <Navigate to="/" replace />;
    return children;
  };

  // IF NOT LOGGED IN: Show Full Screen Login/Signup
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // IF LOGGED IN: Show Sidebar Layout
  return (
    <div className="flex bg-black min-h-screen">
      
      {/* 1. LEFT SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA (Pushed to the right) */}
      {/* md:ml-20 lg:ml-64 matches sidebar width */}
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