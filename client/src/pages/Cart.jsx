import React, { useState } from 'react'; // Added useState
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { createPaymentOrder, verifyPayment } from '../api/payment';
import LocationPicker from '../components/LocationPicker'; // ✅ Import the component

// --- HELPER: Load Razorpay SDK ---
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  // ✅ New State for Address
  const [deliveryLocation, setDeliveryLocation] = useState(null);

  // Calculation Logic
  const itemTotal = cartItems.reduce((acc, item) => acc + ((item.price || 150) * item.quantity), 0);
  const deliveryFee = itemTotal > 200 ? 0 : 40; 
  const taxes = Math.floor(itemTotal * 0.05); 
  const grandTotal = itemTotal + deliveryFee + taxes;

  // --- PAYMENT HANDLER ---
  const handlePayment = async () => {
      // 1. Validation: Ensure Location is picked
      if (!deliveryLocation) {
          alert("Please select and confirm your delivery location on the map first! 📍");
          return;
      }

      // 2. Load the Script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
      }

      // 3. Create Order on Backend
      try {
          const order = await createPaymentOrder(grandTotal); 
          
          const options = {
              key: "rzp_test_RzhFCVoEpKgm6C", 
              amount: order.amount,
              currency: "INR",
              name: "Flavor Feed",
              description: "Food Order",
              order_id: order.id, 
              
              handler: async function (response) {
                  try {
                      // ✅ Send Location to Backend
                      await verifyPayment({
                          razorpay_payment_id: response.razorpay_payment_id,
                          cartItems: cartItems,
                          totalAmount: grandTotal,
                          deliveryLocation: deliveryLocation // <--- Sending coordinates
                      });

                      alert("Order Placed Successfully! 🥘");
                      clearCart(); 
                      navigate('/orders'); 
                      
                  } catch (error) {
                      console.error("Order Save Failed:", error);
                      alert("Payment succeeded, but order saving failed.");
                  }
              },
              prefill: {
                  name: "Ayush Verma", 
                  email: "ayush@example.com",
                  contact: "9999999999",
              },
              theme: {
                  color: "#e11d48", 
              },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();

      } catch (error) {
          console.error("Payment Error:", error);
          alert("Something went wrong creating the order.");
      }
  };

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
          
          {/* --- LEFT COLUMN: ITEMS & MAP --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. MAP SECTION (Placed here so user sees it first) */}
            <LocationPicker onConfirm={setDeliveryLocation} />

            {/* 2. CART ITEMS */}
            <div className="space-y-4">
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
            </div>

            <button 
              onClick={clearCart} 
              className="mt-6 flex items-center gap-2 px-5 py-2.5 border border-red-900/30 text-red-500 rounded-xl hover:bg-red-950/30 hover:border-red-500 hover:text-red-400 transition-all duration-300 text-sm font-bold group"
            >
              Clear Cart
            </button>
          </div>

          {/* --- RIGHT COLUMN: BILL SUMMARY --- */}
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

                {/* PAY BUTTON */}
                <button 
                  onClick={handlePayment}
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