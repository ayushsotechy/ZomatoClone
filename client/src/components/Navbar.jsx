import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import Cart Hook

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart(); // Get cart items

    return (
        <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="text-3xl font-extrabold text-red-500 italic">
                zomato
            </Link>

            <div className="flex gap-6 items-center">
                {/* Cart Icon Link */}
                <Link to="/cart" className="relative group">
                    <span className="text-2xl">🛒</span>
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItems.length}
                        </span>
                    )}
                </Link>

                {user ? (
                    <>
                        <span className="text-gray-700 text-lg hidden md:block">
                            Hi, <span className="font-semibold">{user.username || user.name}</span>
                        </span>
                        <button 
                            onClick={logout}
                            className="text-red-500 border border-red-500 px-4 py-1 rounded hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-500 text-lg hover:text-gray-800">Log in</Link>
                        <Link to="/signup" className="text-gray-500 text-lg hover:text-gray-800">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;