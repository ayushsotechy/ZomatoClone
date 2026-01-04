import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../api/payment';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
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
    <div className="min-h-screen bg-black text-white p-6 pb-24 md:pl-24">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
           <p>No orders found.</p>
           <Link to="/" className="text-red-500 underline">Order something tasty!</Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {orders.map((order) => (
            <div key={order._id} className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
              
              {/* Header: ID and Status */}
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

              {/* Items List */}
              <div className="space-y-3 mb-4">
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden">
                          {/* If you have images, use them here. Using video poster or placeholder for now */}
                          <div className="w-full h-full flex items-center justify-center text-xs">🍔</div>
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-200">
                             {item.food ? item.food.name : "Unknown Item"}
                          </p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                       </div>
                    </div>
                 ))}
              </div>

              {/* Footer: Total */}
              <div className="flex justify-between items-center pt-2">
                 <span className="text-sm text-gray-400">Total Paid</span>
                 <span className="text-lg font-bold text-white">₹{order.totalAmount}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;