const Razorpay = require("razorpay");
const Order = require('../models/order.model');
const Food = require('../models/food.model'); // ✅ Needed to find the Restaurant
const User = require('../models/user.model'); // ✅ Needed to get Restaurant's Location

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: "rzp_test_RzhFCVoEpKgm6C", 
  key_secret: "t5O45CoT25Ppxfve02I0EaP9",
});

exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body; 

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order); 

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).send(error);
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    // ✅ 1. Extract deliveryLocation from req.body
    const { razorpay_payment_id, cartItems, totalAmount, deliveryLocation } = req.body;
    const userId = req.user._id; 

    // ✅ 2. Find the Restaurant's Location
    // We look at the first item in the cart to find the foodPartner (Restaurant)
    // Assumption: All items in the cart belong to the SAME restaurant.
    let restaurantLoc = { lat: 28.6304, lng: 77.2177 }; // Default Fallback (Connaught Place)

    if (cartItems.length > 0) {
        // Fetch the food item to get the owner ID
        const foodItem = await Food.findById(cartItems[0]._id).populate('foodPartner');
        
        if (foodItem && foodItem.foodPartner && foodItem.foodPartner.location) {
            restaurantLoc = {
                lat: foodItem.foodPartner.location.lat,
                lng: foodItem.foodPartner.location.lng
            };
        }
    }

    // 3. Create the Order in DB
    const newOrder = new Order({
      user: userId,
      items: cartItems.map(item => ({
        food: item._id,
        quantity: item.quantity,
        price: item.price || 150
      })),
      totalAmount,
      paymentId: razorpay_payment_id,
      status: 'Placed',
      
      // ✅ SAVE THE COORDINATES
      deliveryLocation: deliveryLocation, 
      restaurantLocation: restaurantLoc 
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
      .populate('items.food') 
      .sort({ createdAt: -1 }); 

    res.json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Find order and update status
    const order = await Order.findByIdAndUpdate(
        orderId, 
        { status: status }, 
        { new: true } // Return updated doc
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};