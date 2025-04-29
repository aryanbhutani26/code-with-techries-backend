import express from "express";
import { register, login, getMyProfile, updateMyProfile, uploadProfilePicture, changePassword, fetchStudentByEmail, deleteStudent } from "../controller/studentController.js";
import { protectStudent } from "../middleware/studentAuth.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myprofile", protectStudent, getMyProfile);
router.get("/myprofile/email/:email", protectAdmin, fetchStudentByEmail)
router.put("/updateprofile", protectStudent, updateMyProfile);
router.put("/myprofile/picture", protectStudent, upload.single("image"), uploadProfilePicture);
router.put("/myprofile/changepassword", protectStudent, changePassword);
router.delete("/myprofle/delete/:id", protectStudent, deleteStudent);

export default router;