const foodPartner = require("../models/foodpartner.model");
const user = require("../models/user.model");
// const foodPartnerModel = require('../models/foodpartner.model');
const jwt = require("jsonwebtoken");

async function authFoodPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Please login first!",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const partner = await foodPartner.findById(decoded.userId);
    console.log(partner);
    if (!partner) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
    req.foodie = partner;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
async function userPartnerMiddleware(req, res, next) {
  const token = req.cookies.token;

  try {
    if (!token) {
      return res.status(401).json({
        message: "Please login first!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await user.findById(decoded.userId);

    if (!existingUser) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    req.user = existingUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authFoodPartnerMiddleware, userPartnerMiddleware };
