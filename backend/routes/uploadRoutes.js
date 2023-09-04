import express from "express";
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import upload from "../helpers/multer.js"; 

const router = express.Router(); 

router.route("/").patch(upload.single("logo"), async (req, res) => {
    // Gets the local file path of the uploaded image from multer
    const localFilePath = req.file.path;

    // Upload the local image to Cloudinary 
    const result = await cloudinaryUploader(localFilePath);

    // Send the Cloudinary URL of the uploaded image as a response
    res.send(result.url);
});

export default router; 