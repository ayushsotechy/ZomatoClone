const foodModel = require('../models/food.model');
const uploadService = require('../services/storage.service'); 
const foodDao = require('../dao/food.dao');
const { v4:uuid} = require('uuid');


async function createFood(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No video file uploaded" });
        }

        const videoUrl = await uploadService.uploadToImageKit(req.file, uuid());

        // --- DEBUGGING LOGS ---
        // Check what the middleware attached. It's usually req.user or req.foodPartner
        console.log("Logged in user:", req.foodie); 
        console.log("Body data:", req.body);
        // ----------------------

        const foodData = {
            ...req.body,            // Gets name, description
            video: videoUrl,        // Gets the video URL
            description: req.body.desc, // Ensure description is included
            // IMPORTANT: You must manually link the authenticated user!
            // Note: Check your auth.middleware.js to see if it uses req.user or req.foodPartner
            foodPartner: req.foodie._id 

        };

        console.log("Final data to save:", foodData); // Check if everything is here now

        const savedFood = await foodDao.createFood(foodData);

        res.status(201).json({
            message: "Food created successfully",
            data: savedFood
        });

    } catch (error) {
        console.log("Error in createFood:", error);
        res.status(500).json({ message: "Error creating food" });
    }
}

async function getAllFoods(req,res){
    try {
    const foods = await foodModel.find()
      .populate("foodPartner", "username name profileImage") // Populate the Restaurant info
      
      // ✅ POPULATE COMMENTS AND REPLIES
      .populate({
        path: "comments",
        populate: [
          { 
            path: "user", 
            select: "username name" // Get username for the main comment
          },
          { 
            path: "replies.user", 
            select: "username name" // Get username for the replies
          }
        ]
      })
      .sort({ createdAt: -1 }); // Show newest reels first

    res.json(foods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
async function getFoodsByPartner(req, res) {
    try {
        const { partnerId } = req.params;
        const foods = await foodDao.getFoodsByPartner(partnerId);
        
        if (!foods || foods.length === 0) {
            return res.status(404).json({ message: "No foods found for this partner" });
        }

        res.status(200).json({
            message: "Partner foods fetched",
            data: foods,
            partner: foods[0].foodPartner // Send partner details separately for easy access
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching partner foods" });
    }
}
async function replyToComment(req,res){
    try {
    const { foodId, commentId, text } = req.body;
    
    // Check if user exists (Handling both User and Partner logins)
    const userId = req.user?._id || req.foodie?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    const comment = food.comments.id(commentId); 
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // --- SAFETY CHECK FOR OLD DATA ---
    // If 'replies' array doesn't exist yet, create it!
    if (!comment.replies) {
        comment.replies = [];
    }
    // ---------------------------------

    comment.replies.push({
      user: userId,
      text: text,
      createdAt: new Date()
    });

    await food.save();

    res.status(200).json({ message: "Reply added!", food });
  } catch (error) {
    console.error("Reply Error:", error); // Print error to terminal so you can see it
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}

async function toggleCommentLike(req,res){
  try {
    const { foodId, commentId, replyId } = req.body;
    const userId = req.user._id;

    const food = await foodModel.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food not found" });

    // 1. Find the Main Comment
    const comment = food.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // 2. Determine Target (Comment vs Reply)
    let target = comment;
    if (replyId) {
      target = comment.replies.id(replyId);
      if (!target) return res.status(404).json({ message: "Reply not found" });
    }

    // 3. Toggle Logic
    const index = target.likes.indexOf(userId);
    if (index === -1) {
      target.likes.push(userId); // Add Like
    } else {
      target.likes.splice(index, 1); // Remove Like
    }

    await food.save();
    res.json({ success: true, likes: target.likes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
    createFood,
    getAllFoods,
    getFoodsByPartner,
    replyToComment,
    toggleCommentLike,
};