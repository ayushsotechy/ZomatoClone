const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth.controller');

//user auth APIs
router.post('/user/register',registerController.registerUser);
router.post('/user/login',registerController.loginUser);
router.get('/user/logout',registerController.logoutUser);

//food partner auth APIs
router.post('/food-partner/register',registerController.registerFoodPartner);
router.post('/food-partner/login',registerController.loginFoodPartner);
router.get('/food-partner/logout',registerController.logoutFoodPartner);


module.exports = router;