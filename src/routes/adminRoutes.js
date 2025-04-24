import express from "express";
import { loginAdmin, updateAdminNameController, uploadAdminProfilePicture } from "../controller/adminController.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.put("/updateprofile", protectAdmin, updateAdminNameController);
router.post("/profile/picture", protectAdmin, upload.single("image"), uploadAdminProfilePicture);

export default router;