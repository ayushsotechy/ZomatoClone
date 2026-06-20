const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const registerController = require('../controllers/auth.controller');
const { userPartnerMiddleware } = require('../middlewares/auth.middleware.js');
const { updatePartnerLocation } = require('../controllers/auth.controller');
// const { userPartnerMiddleware } = require('../middlewares/auth.middleware');

// --- STANDARD AUTH ROUTES ---
router.post('/user/register', registerController.registerUser);
router.post('/user/login', registerController.loginUser);
router.get('/user/logout', registerController.logoutUser);

router.post('/food-partner/register', registerController.registerFoodPartner);
router.post('/food-partner/login', registerController.loginFoodPartner);
router.get('/food-partner/logout', registerController.logoutFoodPartner);

// ✅ PROFILE ROUTE (Uses the fixed controller)
router.get('/me', userPartnerMiddleware, registerController.getMyProfile);

router.get('/get-user/:id', registerController.getUserById);



router.put('/update-location', userPartnerMiddleware, updatePartnerLocation);

// --- GOOGLE AUTH ROUTES ---

// 1. Start Login
router.get("/google", (req, res, next) => {
  // Extract role from frontend query, default to 'user'
  const role = req.query.role || 'user';
  
  // Pass it as 'state' to Google
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    state: role 
  })(req, res, next);
});

// 2. Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`
  }),
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
