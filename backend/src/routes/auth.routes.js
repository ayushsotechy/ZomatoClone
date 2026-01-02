const express = require('express');
const router = express.Router();
const passport = require('passport'); // Added for Google Auth
const jwt = require('jsonwebtoken');  // Added for Token Generation
const registerController = require('../controllers/auth.controller'); // Your existing controller
const { userPartnerMiddleware } = require('../middlewares/auth.middleware');

// --- EXISTING AUTH ROUTES ---

// User auth APIs
router.post('/user/register', registerController.registerUser);
router.post('/user/login', registerController.loginUser);
router.get('/user/logout', registerController.logoutUser);
router.get('/me', userPartnerMiddleware, registerController.getMyProfile);

// Food partner auth APIs
router.post('/food-partner/register', registerController.registerFoodPartner);
router.post('/food-partner/login', registerController.loginFoodPartner);
router.get('/food-partner/logout', registerController.logoutFoodPartner);


// --- NEW GOOGLE OAUTH ROUTES ---

// 1. Redirect user to Google to choose an account
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Google calls this back after the user logs in
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    // At this point, passport.js has verified the user and attached it to req.user
    
    // Generate JWT Token (Same as your standard login logic)
    const token = jwt.sign(
        { id: req.user._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
    );

    // Redirect to Frontend with the token in the URL
    // Ensure CLIENT_URL is set in your .env file
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

module.exports = router;