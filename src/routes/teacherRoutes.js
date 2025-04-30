import express from "express";
import { deleteTeacherByUsername, getTeacherByUsername, getTeacherProfile, loginTeacher, registerTeacher, updateTeacher, uploadTeacherImage } from "../controller/teacherController.js";
import { protectTeacher } from "../middleware/teacherAuth.js";
import upload from "../middleware/upload.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import setUserType from "../utils/userType.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", protectAdmin, registerTeacher);
router.post("/login", loginTeacher);
router.get("/myprofile", protect(["teacher"]), getTeacherProfile);
router.get("/myprofile/:username", getTeacherByUsername);
router.put("/myprofile/update", protectTeacher, updateTeacher);
router.put("/myprofile/picture", protectTeacher, setUserType("teacher"), upload.single("profilePicture"), uploadTeacherImage);
router.delete("/delete/:username", protectAdmin, deleteTeacherByUsername);

export default router;