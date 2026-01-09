const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

    location: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
    address: { type: String } // Optional: Human readable address
  },
})

const foodPartner = mongoose.model('foodPartner', foodPartnerSchema);

module.exports = foodPartner;