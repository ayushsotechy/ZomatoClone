const Razorpay = require("razorpay");
const Order = require('../models/order.model');

// Initialize Razorpay with your keys
// ⚠️ REPLACE WITH YOUR ACTUAL KEYS IF NOT USING .ENV FILE YET
const razorpay = new Razorpay({
  key_id: "rzp_test_RzhFCVoEpKgm6C", 
  key_secret: "t5O45CoT25Ppxfve02I0EaP9",
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // Amount comes from Frontend

    const options = {
      amount: amount * 100, // Razorpay takes amount in PAISE (₹1 = 100 paise)
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order); // Send Order ID back to Frontend

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).send(error);
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const { razorpay_payment_id, cartItems, totalAmount } = req.body;
    const userId = req.user._id; // Comes from authMiddleware

    // 1. (Optional but recommended) Verify signature here using crypto
    // For this project, we will assume if payment_id exists, it's valid.

    // 2. Create the Order in DB
    const newOrder = new Order({
      user: userId,
      items: cartItems.map(item => ({
        food: item._id,
        quantity: item.quantity,
        price: item.price || 150
      })),
      totalAmount,
      paymentId: razorpay_payment_id,
      status: 'Placed'
    });

    await newOrder.save();

    res.json({ success: true, order: newOrder });

  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.food') // Get actual food details (name, image)
      .sort({ createdAt: -1 }); // Newest first

    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};