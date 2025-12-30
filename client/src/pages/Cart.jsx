import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty 🍔</h2>
                <p className="text-gray-500 mb-8">Go watch some reels and get hungry!</p>
                <Link to="/" className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition">
                    Browse Food
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Your Order</h1>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-4">
                                {/* If we had food images, we'd show them here. using a placeholder for now */}
                                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                                    🍗
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">{item.description}</p>
                                    <p className="text-red-500 font-bold mt-1">₹{item.price || 100} x {item.quantity}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => removeFromCart(item._id)}
                                className="text-gray-400 hover:text-red-500 font-medium transition"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    
                    {/* Total Section */}
                    <div className="bg-gray-50 p-6 flex justify-between items-center">
                        <div>
                            <p className="text-gray-500">Total Amount</p>
                            <h2 className="text-3xl font-bold text-gray-800">₹{totalPrice}</h2>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={clearCart}
                                className="text-red-500 font-bold px-6 py-3 hover:bg-red-50 rounded-lg transition"
                            >
                                Clear Cart
                            </button>
                            <button 
                                onClick={() => alert("Payment Gateway coming soon! 🤑")}
                                className="bg-red-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-600 shadow-lg transition transform active:scale-95"
                            >
                                Pay Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;