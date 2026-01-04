import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ NEW: State for Mobile Menu Toggle
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // --- HANDLE DISPLAY NAME ---
  const displayName = user?.username || user?.name || "User";
  const displayInitial = displayName[0]?.toUpperCase() || "U";
  // ---------------------------

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to highlight active link
  const NavItem = ({ to, icon, label, active }) => (
    <Link 
      to={to} 
      className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${active ? 'font-bold text-white bg-white/10' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
    >
      {icon}
      <span className="text-base tracking-wide hidden lg:block">{label}</span>
    </Link>
  );

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Fixed Left) --- */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-20 lg:w-64 bg-black border-r border-gray-800 z-50 px-3 py-6 justify-between">
        
        {/* Top Section */}
        <div className="flex flex-col gap-8">
          
          {/* LOGO */}
          <Link to="/" className="px-3 lg:px-4 mb-2 flex items-center gap-3">
             {/* Small Logo for Tablet */}
             <div className="lg:hidden bg-gradient-to-tr from-red-600 to-orange-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
             </div>
             {/* Full Logo for Desktop */}
             <span className="hidden lg:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500 tracking-tight font-sans">
                FlavorFeed
             </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-2">
            <NavItem 
              to="/" 
              active={location.pathname === '/'}
              label="Home"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              }
            />

            <NavItem 
              to="/search" 
              active={location.pathname === '/search'}
              label="Search"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
            />

            <NavItem 
              to="/orders" 
              active={location.pathname === '/orders'}
              label="My Orders"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              }
            />

            <div className="relative">
              <NavItem 
                to="/cart" 
                active={location.pathname === '/cart'}
                label="Cart"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/cart' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                }
              />
              {cartCount > 0 && (
                <span className="absolute top-2 left-7 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-black">
                  {cartCount}
                </span>
              )}
            </div>
          </nav>
        </div>

        {/* Bottom Section: Profile & More */}
        <div className="flex flex-col gap-4">
           {user ? (
             <div className="group relative">
                <button className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-white/10 transition-all">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white border border-white/20">
                     {displayInitial}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                     <span className="text-sm font-bold text-white truncate max-w-[150px]">{displayName}</span>
                     <span className="text-[10px] text-gray-400">View Profile</span>
                  </div>
                </button>
                
                {/* Mini Logout Menu (Desktop) */}
                <button onClick={handleLogout} className="mt-2 text-xs text-red-500 hover:text-red-400 pl-4 lg:pl-14 font-bold uppercase tracking-wider">
                   Logout
                </button>
             </div>
           ) : (
             <Link to="/login" className="bg-white text-black font-bold py-3 px-4 rounded-xl text-center hover:bg-gray-200 transition">
                Log In
             </Link>
           )}
        </div>
      </aside>

      {/* --- MOBILE BOTTOM BAR --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-black border-t border-gray-800 z-50 flex justify-around items-center py-3 px-2 pb-5">
        <Link to="/" className={`p-2 ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
        </Link>
        
        <Link to="/search" className={`p-2 ${location.pathname === '/search' ? 'text-white' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </Link>

        <Link to="/orders" className={`p-2 ${location.pathname === '/orders' ? 'text-white' : 'text-gray-400'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
             <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
           </svg>
        </Link>

        <Link to="/cart" className={`p-2 relative ${location.pathname === '/cart' ? 'text-white' : 'text-gray-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill={location.pathname === '/cart' ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          {cartCount > 0 && <span className="absolute top-1 right-0 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">{cartCount}</span>}
        </Link>
        
        {/* ✅ MOBILE PROFILE + LOGOUT MENU */}
        <div className="relative p-2">
            {/* 1. Popup Menu (Shows only when showMobileMenu is true) */}
            {showMobileMenu && (
                <div className="absolute bottom-14 right-0 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl p-3 min-w-[140px] flex flex-col gap-2 z-[60] animate-in slide-in-from-bottom-2 fade-in">
                    <p className="text-xs text-gray-400 font-bold px-2 mb-1 truncate">@{displayName}</p>
                    <button 
                       onClick={handleLogout} 
                       className="text-red-500 text-xs font-bold hover:bg-white/5 p-2 rounded-lg text-left flex items-center gap-2"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                       </svg>
                       Logout
                    </button>
                </div>
            )}
            
            {/* 2. Avatar Button (Toggles Menu) */}
            <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white border transition-all ${showMobileMenu ? 'border-white ring-2 ring-white/20' : 'border-white/20'}`}
            >
                {displayInitial}
            </button>
        </div>

      </nav>
    </>
  );
};

export default Sidebar;