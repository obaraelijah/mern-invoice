import fs from "fs";
import multer from "multer";
import path from "path";

// Check if the uploads directory exists-> if not, create it
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads")
}

//config multer storage for uploaded files cb-> callback
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files should be stored
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for each uploaded file
        cb(
            null,
            `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});


// Function to check if the uploaded file has an allowed image type
function checkImageType(file, cb) {
    // regex for allowed file types (jpeg, jpg, png)
    const filetypes = /jpeg|jpg|png/;
    
    // Check if the file's extension matches one of the allowed types
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    
    // Check if the file's MIME type (provided by the browser) matches an allowed type
    const mimetype = filetypes.test(file.mimetype);

    // If both the extension and MIME type are valid ( supported image type)
    if (extname && mimetype) {
        // Call the callback function with no error and 'true' to indicate success
        return cb(null, true);
    } else {
        cb("Unsupported file format. You can only upload jpeg, jpg, and png");
    }
}

const upload = multer({
    storage, // Configuration for storing uploaded files
    limits: { fileSize: 1024 * 1024 }, // Limit on file size 1 MB
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb); // filter uploaded files
    },
});

export default upload;