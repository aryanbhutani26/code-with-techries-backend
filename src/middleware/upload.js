import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinaryConfig.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const userType = req.userType || "general"; 
    return {
      folder: `${userType}_profiles`,
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });
export default upload;
