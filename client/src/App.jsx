import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PartnerDashboard from './pages/PartnerDashboard';
import Home from './pages/Home';
import Cart from './pages/Cart'; // 1. Import Cart
import RestaurantProfile from './pages/RestaurantProfile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PartnerDashboard />} />
        
        {/* 2. Add this Route! */}
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/restaurant/:id" element={<RestaurantProfile />} />
      </Routes>
    </>
  );
}

export default App;