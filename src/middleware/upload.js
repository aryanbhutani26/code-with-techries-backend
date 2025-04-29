import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinaryConfig.js";

// Define the storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const userType = req.userType || "general"; // Get from req instead of req.body
    return {
      folder: `${userType}_profiles`,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

// Create the upload middleware using multer with Cloudinary storage
const upload = multer({ storage });
export default upload;
