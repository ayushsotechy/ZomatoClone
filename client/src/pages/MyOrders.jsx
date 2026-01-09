import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/payment';
import { Link } from 'react-router-dom';
import OrderTracker from '../components/OrderTracker';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  const RESTAURANT_LOC = { lat: 28.6304, lng: 77.2177 }; 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedData);
      } catch (error) {
        console.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Loading your cravings...</div>;

  return (
    // h-screen is CRITICAL here because your body overflow is hidden
    <div className="h-screen bg-black text-white p-6 md:pl-24 flex flex-col">
      
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 shrink-0">
        📦 My Orders
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden pb-4">
        
        {/* --- LEFT: SCROLLABLE ORDER LIST --- */}
        {/* We use 'custom-scrollbar' from your index.css here */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
            
            {orders.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No orders found.</p>
                    <Link to="/" className="text-red-500 underline">Order something tasty!</Link>
                </div>
            ) : (
                <div className="space-y-6 max-w-4xl">
                {orders.map((order) => (
                    <div key={order._id} className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                    
                    <div className="flex justify-between items-start mb-4 border-b border-gray-800 pb-3">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Order #{order._id.slice(-6).toUpperCase()}</span>
                            <span className="text-xs text-gray-400">{new Date(order.createdAt).toDateString()}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Delivered' ? 'bg-green-900/30 text-green-500' : 'bg-blue-900/30 text-blue-500'
                        }`}>
                            {order.status || 'Preparing'}
                        </span>
                    </div>

                    <div className="space-y-3 mb-4">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center text-lg">🍔</div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-200">
                                        {item.food ? item.food.name : "Unknown Item"}
                                    </p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-800/50 mt-2">
                        <div>
                            <span className="text-xs text-gray-400 block">Total Paid</span>
                            <span className="text-lg font-bold text-white">₹{order.totalAmount}</span>
                        </div>
                        
                        <button 
                            onClick={() => setTrackingOrder(order)}
                            className="bg-red-600 hover:bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-red-900/20 active:scale-95"
                        >
                            Track Order 📍
                        </button>
                    </div>

                    </div>
                ))}
                </div>
            )}
        </div>

        {/* --- RIGHT: LIVE TRACKER (STICKY) --- */}
        {trackingOrder && (
            <div className="lg:w-[450px] shrink-0 animate-fade-in pb-20 overflow-y-auto custom-scrollbar">
                <div className="bg-[#151515] border border-red-900/30 p-4 rounded-2xl sticky top-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
                            <span>🛵</span> Live Tracking
                        </h2>
                        <button 
                            onClick={() => setTrackingOrder(null)}
                            className="text-xs text-gray-400 hover:text-white underline"
                        >
                            Close
                        </button>
                    </div>
                    
                    <OrderTracker 
    // ✅ KEY PROP: Forces a complete reset when switching orders
    key={trackingOrder._id} 

    userLocation={trackingOrder.deliveryLocation} 
    restaurantLocation={
        trackingOrder.restaurantLocation || { lat: 28.6304, lng: 77.2177 }
    }
    orderStatus={trackingOrder.status} 
    orderId={trackingOrder._id}
/>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;