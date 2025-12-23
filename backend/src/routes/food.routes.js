const express = require('express');
const router = express.Router();
const foodController = require("../controllers/food.controller");
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { createFoodValidator } = require('../validators/food.validator');
const validate = require('../middlewares/validate.middleware');



// const upload = multer({
//     storage: multer.memoryStorage(),
// })

router.post('/create', 
    authMiddleware.authFoodPartnerMiddleware, 
    upload.single('video'),
    // createFoodValidator, // <--- Runs validation rules
    // validate,            // <--- Checks if rules passed
    foodController.createFood);

router.get('/all',
    authMiddleware.userPartnerMiddleware,
    foodController.getAllFoods,
)

        
module.exports = router;