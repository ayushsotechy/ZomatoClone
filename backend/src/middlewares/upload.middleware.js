// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')  // Files will be saved in an 'uploads' folder
    },
    filename: function (req, file, cb) {
        // Renames file to avoid duplicates (e.g., video-16789.mp4)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;