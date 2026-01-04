const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const registerController = require('../controllers/auth.controller');
const { userPartnerMiddleware } = require('../middlewares/auth.middleware');

// --- STANDARD AUTH ROUTES ---
router.post('/user/register', registerController.registerUser);
router.post('/user/login', registerController.loginUser);
router.get('/user/logout', registerController.logoutUser);

router.post('/food-partner/register', registerController.registerFoodPartner);
router.post('/food-partner/login', registerController.loginFoodPartner);
router.get('/food-partner/logout', registerController.logoutFoodPartner);

// ✅ PROFILE ROUTE (Uses the fixed controller)
router.get('/me', userPartnerMiddleware, registerController.getMyProfile);


// --- GOOGLE AUTH ROUTES ---

// 1. Start Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // Generate Token using the SAME structure as your normal login
    // Note: passport usually returns the user in req.user
    const token = jwt.sign(
        { userId: req.user._id }, // ✅ Changed 'id' to 'userId' to match your middleware logic usually
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
    );

    // Redirect to Frontend with Token
    // Ensure CLIENT_URL is http://localhost:5173 or https://flavorfeed.in
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

module.exports = router;