const foodModel = require('../models/food.model');

class foodDao{
    async createFood(foodData){
        const savedFood = await foodModel.create(foodData);
        return savedFood;
    }
    async getAllFoods(){
        const foods = await foodModel.find();
        return foods;
    }
}

module.exports = new foodDao();