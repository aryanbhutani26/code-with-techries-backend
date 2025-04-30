import express from "express";
import { loginAdmin, updateAdmin, uploadAdminProfilePicture } from "../controller/adminController.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";
import setUserType from "../utils/userType.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.put("/updateprofile", protectAdmin, updateAdmin);
router.post("/profile/picture", protectAdmin, setUserType("admin"), upload.single("profilePicture"), uploadAdminProfilePicture);

export default router;