const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware"); // Needed to get User ID
const { createOrder, verifyAndSaveOrder, getUserOrders } = require("../controllers/payment.controller");

router.post("/create-order", createOrder); // No Auth needed for initial amount check (or add if you prefer)

// 👇 ADD THIS NEW ROUTE
router.post("/verify", authMiddleware.userPartnerMiddleware, verifyAndSaveOrder); 

router.get("/orders", authMiddleware.userPartnerMiddleware, getUserOrders);

module.exports = router;