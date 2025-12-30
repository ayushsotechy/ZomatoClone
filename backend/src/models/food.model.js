const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    video: { type: String, required: false },
    description: { type: String },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner" // ✅ CHANGED: Capital 'P' to match your Model definition
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" // Stores IDs of users who liked
    }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

const foodModel = mongoose.model("food", foodSchema);
module.exports = foodModel;