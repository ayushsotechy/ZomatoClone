const express = require('express');
const router = express.Router();
const foodController = require("../controllers/food.controller");
// const authMiddleware = require('../middlewares/auth.middleware'); // Kept commented out for public feed
const upload = require('../middlewares/upload.middleware');
const foodModel = require('../models/food.model'); // Import the model directly for likes

// 1. Create Food (Upload Reel)
router.post('/create', 
    // authMiddleware.authFoodPartnerMiddleware, 
    upload.single('video'),
    foodController.createFood
);

// 2. Get All Foods (Public Feed)
router.get('/all', foodController.getAllFoods);

// --- NEW: SOCIAL FEATURES ---

// 3. Like a Reel
router.post('/like/:id', async (req, res) => {
    try {
        const { userId } = req.body; // In real app, use req.user._id from middleware
        const food = await foodModel.findById(req.params.id);
        
        if (!food) return res.status(404).json({ message: "Food not found" });

        // Toggle Like logic
        if (food.likes.includes(userId)) {
            food.likes.pull(userId); // Unlike
        } else {
            food.likes.push(userId); // Like
        }
        
        await food.save();
        res.json({ success: true, likes: food.likes.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error liking post" });
    }
});

// 4. Comment on a Reel
router.post('/comment/:id', async (req, res) => {
    try {
        const { userId, text } = req.body;
        const food = await foodModel.findById(req.params.id);
        
        if (!food) return res.status(404).json({ message: "Food not found" });

        food.comments.push({ user: userId, text });
        await food.save();
        
        res.json({ success: true, comments: food.comments });
    } catch (err) {
        res.status(500).json({ message: "Error commenting" });
    }
});
router.get('/partner/:partnerId', foodController.getFoodsByPartner);

module.exports = router;