const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Price at time of purchase
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Razorpay Payment ID
  status: { 
    type: String, 
    enum: ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'], 
    default: 'Placed' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);