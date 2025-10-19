const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage setup
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "healthmate_reports", // Folder name on Cloudinary
        allowed_formats: ["jpg", "png", "pdf"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,
    },
});

// Multer middleware
const upload = multer({ storage });

module.exports = { cloudinary, upload };
