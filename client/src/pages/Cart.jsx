import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // ✅ FIX: Added safety check (item.price || 150) to prevent NaN
  const itemTotal = cartItems.reduce((acc, item) => acc + ((item.price || 150) * item.quantity), 0);
  
  const deliveryFee = itemTotal > 200 ? 0 : 40; 
  const taxes = Math.floor(itemTotal * 0.05); 
  const grandTotal = itemTotal + deliveryFee + taxes;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-900 p-8 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-400 mb-8 text-center">Looks like you haven't added any delicious food yet.</p>
        <Link to="/" className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105">
           Browse Food
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span>🛒</span> My Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-[#0f0f0f] border border-gray-800 p-4 rounded-2xl flex gap-4 items-center hover:border-gray-700 transition-colors">
                
                <div className="w-20 h-20 bg-gray-800 rounded-xl overflow-hidden shrink-0">
                  {item.video ? (
                    <video src={item.video} className="w-full h-full object-cover opacity-80" muted />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍗</div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">@{item.foodPartner?.username || "Restaurant"}</p>
                  
                  {/* ✅ FIX: Added Fallback Price Display */}
                  <div className="text-red-500 font-bold">₹{item.price || 150}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <div className="flex items-center bg-gray-800 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition"
                      >+</button>
                   </div>
                   
                   <button 
                     onClick={() => removeFromCart(item._id)}
                     className="text-xs text-red-500 hover:text-red-400 hover:underline"
                   >
                     Remove
                   </button>
                </div>

              </div>
            ))}
            
            <button 
  onClick={clearCart} 
  className="mt-6 flex items-center gap-2 px-5 py-2.5 border border-red-900/30 text-red-500 rounded-xl hover:bg-red-950/30 hover:border-red-500 hover:text-red-400 transition-all duration-300 text-sm font-bold group"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
  Clear Cart
</button>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl sticky top-4">
                <h3 className="font-bold text-xl mb-6 text-gray-200">Bill Details</h3>
                
                <div className="space-y-3 mb-6">
                   <div className="flex justify-between text-gray-400 text-sm">
                      <span>Item Total</span>
                      <span>₹{itemTotal}</span>
                   </div>
                   <div className="flex justify-between text-gray-400 text-sm">
                      <span>Delivery Fee</span>
                      <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                        {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                      </span>
                   </div>
                   <div className="flex justify-between text-gray-400 text-sm">
                      <span>Taxes (5%)</span>
                      <span>₹{taxes}</span>
                   </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-6">
                   <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-white">Grand Total</span>
                      <span className="font-bold text-xl text-white">₹{grandTotal}</span>
                   </div>
                </div>

                <button 
                  onClick={() => alert("Redirecting to Payment Gateway...")}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg transform active:scale-[0.98] transition-all"
                >
                   Pay Now
                </button>
                
                <p className="text-[10px] text-center text-gray-500 mt-4">
                   By proceeding, you agree to our Terms & Conditions.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;