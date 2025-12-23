const { body } = require('express-validator');

const createFoodValidator = [
    // Validate Name
    body('name')
        .notEmpty().withMessage('Food name is required'),

    // Validate Price
    body('price')
        .isNumeric().withMessage('Price must be a number'),

    // Validate Description (Must be > 10 words)
    body('description')
        .trim() // Removes whitespace from start/end
        .notEmpty().withMessage('Description is required')
        .custom((value) => {
            // Split by spaces/newlines and filter out empty strings
            const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;
            
            if (wordCount <= 10) {
                throw new Error('Description must be more than 10 words long');
            }
            return true; // Validation passed
        }),
];

module.exports = { createFoodValidator };