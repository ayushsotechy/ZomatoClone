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
  try {
    // 1. Get Token (Cookie OR Header)
    let token = req.cookies.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Please login first!" });
    }

    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decoded.userId || decoded.id; 

    // 3. CHECK USER DATABASE
    let account = await user.findById(currentUserId);

    // 4. IF NOT USER, CHECK PARTNER DATABASE
    if (!account) {
        account = await foodPartner.findById(currentUserId);
    }

    // 5. If still not found in EITHER, reject
    if (!account) {
      return res.status(401).json({ message: "Unauthorized access: User not found." });
    }

    // 6. Attach to req.user (Works for both!)
    req.user = account;
    next();

  } catch (error) {
    console.log("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { authFoodPartnerMiddleware, userPartnerMiddleware };
