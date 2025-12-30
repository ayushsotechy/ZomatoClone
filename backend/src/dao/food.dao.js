const foodModel = require('../models/food.model');

class foodDao {
    async createFood(foodData) {
        const savedFood = await foodModel.create(foodData);
        return savedFood;
    }

    async getAllFoods() {
        const foods = await foodModel.find()
            .populate("foodPartner") // 1. Gets the Restaurant Name
            .populate("comments.user", "username"); // 2. Gets the Commenter Name (only username)
        
        return foods;
    }
    async getFoodsByPartner(partnerId) {
        // Find foods where 'foodPartner' matches the ID
        const foods = await foodModel.find({ foodPartner: partnerId })
            .populate("foodPartner")
            .populate("comments.user", "username");
        return foods;
    }
}

module.exports = new foodDao();