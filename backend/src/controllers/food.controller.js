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
    try{
        const foods = await foodDao.getAllFoods();
        res.status(200).json({
            message:"Foods fetched successfully",
            data:foods
        }); 
    }
    catch(err){
        return res.status(500).json({message:"Error fetching foods"});
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

module.exports = {
    createFood,
    getAllFoods,
    getFoodsByPartner
};