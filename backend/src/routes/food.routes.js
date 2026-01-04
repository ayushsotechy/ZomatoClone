const express = require('express');
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authMiddleware = require('../middlewares/auth.middleware'); 
const upload = require('../middlewares/upload.middleware');
const foodModel = require('../models/food.model'); 
// const { toggleCommentLike } = require('../controllers/food.controller');

// 1. Create Food (Upload Reel)
router.post('/create', 
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single('video'),
    foodController.createFood
);

// 2. Get All Foods (Public Feed)
router.get('/all', foodController.getAllFoods);

// --- SOCIAL FEATURES ---
router.post('/comment/reply', 
    authMiddleware.userPartnerMiddleware, 
    foodController.replyToComment
);

// 3. Like a Reel
router.post('/like/:id', async (req, res) => {
    try {
        // SECURITY TIP: Better to use middleware here too, but req.body works for now
        const { userId } = req.body; 
        const food = await foodModel.findById(req.params.id);
        
        if (!food) return res.status(404).json({ message: "Food not found" });

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

// 5. Get Partner Foods
router.get('/partner/:partnerId', foodController.getFoodsByPartner);

router.put('/comment/like', authMiddleware.userPartnerMiddleware, foodController.toggleCommentLike);

module.exports = router;