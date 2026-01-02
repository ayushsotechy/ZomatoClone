import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // --- FIX: HANDLE BOTH USERNAME AND NAME ---
  // Google login usually gives 'name', Standard login gives 'username'
  const displayName = user?.username || user?.name || "User";
  const displayInitial = displayName[0]?.toUpperCase() || "U";
  // ------------------------------------------

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Helper to highlight active link
  const NavItem = ({ to, icon, label, active }) => (
    <Link 
      to={to} 
      className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${active ? 'font-bold text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
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
                     {/* USE THE FIX HERE */}
                     {displayInitial}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                     {/* USE THE FIX HERE */}
                     <span className="text-sm font-bold text-white truncate max-w-[150px]">{displayName}</span>
                     <span className="text-[10px] text-gray-400">View Profile</span>
                  </div>
                </button>
                
                {/* Mini Logout Menu */}
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
        <Link to="/" className="p-2 text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7"><path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" /><path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" /></svg></Link>
        <Link to="/search" className="p-2 text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg></Link>
        <Link to="/cart" className="p-2 text-gray-400 relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          {cartCount > 0 && <span className="absolute top-1 right-0 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center text-white">{cartCount}</span>}
        </Link>
        
        {/* MOBILE PROFILE AVATAR */}
        <div className="p-2">
            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white">
                {displayInitial}
            </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;