import express from "express";
import { register, login, getMyProfile, updateMyProfile, uploadProfilePicture, changePassword, fetchStudentByEmail } from "../controller/studentController.js";
import { protect } from "../middleware/studentAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myprofile", protect, getMyProfile);
router.get("/myprofile/email/:email", protect, fetchStudentByEmail)
router.put("/updateprofile", protect, updateMyProfile);
router.put("/myprofile/picture", protect, upload.single("image"), uploadProfilePicture);
router.put("/myprofile/changepassword", protect, changePassword);

export default router;