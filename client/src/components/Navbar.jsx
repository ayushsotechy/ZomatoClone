import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    // 1. Outer Container: Positions the navbar and adds spacing from top
    <nav className="sticky top-6 z-50 w-full flex justify-center px-4">
      
      {/* 2. PREMIUM GLASS PILL: 
          - Changed bg-black/60 -> bg-white/5 (Subtle white tint for glass effect)
          - Increased blur to backdrop-blur-2xl (Smoother blur)
          - Added a stronger shadow
      */}
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black ring-1 ring-white/5">
        
        <div className="flex justify-between items-center h-14 px-6 sm:px-8">
          
          {/* LEFT: BRAND LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="group flex items-center gap-2">
              <div className="bg-gradient-to-br from-red-600 to-orange-600 p-1.5 rounded-full transform group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              </div>
              {/* Refined Typography */}
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-wide group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-300">
                flavorfeed
              </span>
            </Link>
          </div>

          {/* RIGHT: ACTIONS */}
          {user ? (
            <div className="flex items-center gap-6">
              
              {/* CART ICON */}
              <Link to="/cart" className="relative group flex items-center justify-center">
                <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-black">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* USER AVATAR & LOGOUT */}
              <div className="flex items-center gap-4 pl-6 border-l border-white/10 h-8">
                
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-200 leading-none">{user.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] text-gray-500 hover:text-red-400 font-semibold tracking-wider mt-1 transition-colors uppercase"
                  >
                    Logout
                  </button>
                </div>
                
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-black p-[1px] shadow-inner ring-1 ring-white/10">
                    <div className="h-full w-full rounded-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
                         <span className="text-gray-200 font-bold text-xs">
                            {user.username?.[0]?.toUpperCase()}
                         </span>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            /* IF NOT LOGGED IN */
            <div className="flex gap-4 items-center">
              <Link to="/login" className="text-gray-300 text-sm font-medium hover:text-white transition px-2">Login</Link>
              <Link to="/signup" className="bg-white text-black hover:bg-gray-200 px-5 py-1.5 rounded-full text-xs font-bold transition shadow-lg shadow-white/5 tracking-wide">
                Sign Up
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;