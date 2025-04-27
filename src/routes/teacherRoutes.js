import express from "express";
import { deleteTeacherByUsername, getTeacherByUsername, getTeacherProfile, loginTeacher, registerTeacher, updateTeacher, uploadTeacherImage } from "../controller/teacherController.js";
import { protectTeacher } from "../middleware/teacherAuth.js";
import upload from "../middleware/upload.js";
import { protectAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", protectAdmin, registerTeacher);
router.post("/login", loginTeacher);
router.get("/myprofile", protectTeacher, getTeacherProfile);
router.get("/myprofile/:username", getTeacherByUsername);
router.put("/myprofile/update", protectTeacher, updateTeacher);
router.put("/myprofile/picture", protectTeacher, upload.single("image"), uploadTeacherImage);
router.delete("/delete/:username", protectAdmin, deleteTeacherByUsername);

export default router;