const ImageKit = require("imagekit");
const fs = require('fs');

// Initialize ImageKit with environment variables
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

/**
 * Uploads a file to ImageKit and returns the URL.
 * @param {Object} file - The file object from Multer (req.file)
 * @returns {Promise<string>} - The URL of the uploaded file
 */
async function uploadToImageKit(file, customName) {
    try {
        const response = await imagekit.upload({
            file: fs.createReadStream(file.path), // Read from the local uploads folder
            fileName: customName || file.originalname,
            folder: "/food-videos" // Optional: Organize in folders
        });

        // Delete the local file after successful upload to save space
        fs.unlink(file.path, (err) => {
            if (err) console.error("Failed to delete local file:", err);
        });

        return response.url; // Return only the URL (or return whole response if needed)

    } catch (error) {
        // If upload fails, try to delete the local file anyway so it doesn't pile up
        fs.unlink(file.path, () => {}); 
        throw error; // Re-throw error so the controller handles it
    }
}

module.exports = {
    uploadToImageKit
};