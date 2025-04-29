import express from "express";
import { changePassword, deleteRecruiter, fetchRecruiterByEmail, getRecruiterProfile, loginRecruiter, registerRecruiter, updateRecruiterProfile, uploadRecruiterImage, } from "../controller/recruiterController.js";
import { protectRecruiter } from "../middleware/recruiterAuth.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/register", registerRecruiter);
router.post("/login", loginRecruiter);
router.get("/myprofile", protectRecruiter, getRecruiterProfile);
router.get("/myprofile/email/:email", protectAdmin, fetchRecruiterByEmail);
router.put("/updateprofile", protectRecruiter, updateRecruiterProfile);
router.put("/myprofile/picture", protectRecruiter, upload.single("image"), uploadRecruiterImage);
router.put("/myprofile/changepassword", protectRecruiter, changePassword);
router.delete("/myprofile/delete", protectRecruiter, deleteRecruiter);

export default router;