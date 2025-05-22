import express from "express";
import { changeDeveloperPassword, deleteDeveloper, fetchDeveloperByEmail, getDeveloperProfile, loginDeveloper, registerDeveloper, updateDeveloperProfile, uploadDeveloperProfilePicture } from "../controller/developerController.js";
import { protectDeveloper } from "../middleware/developerAuth.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";
import setUserType from "../utils/userType.js";
import checkEmailExists from "../middleware/checkEmailExists.js";

const router = express.Router();

router.post("/register", checkEmailExists, registerDeveloper);
router.post("/login", loginDeveloper);

// router.get("/myprofile", protect(["developer"]), getDeveloperProfile);
router.get("/myprofile", protectDeveloper, getDeveloperProfile);
router.put("/updateprofile", protectDeveloper, updateDeveloperProfile);
router.get("/myprofile/email/:email", protectAdmin, fetchDeveloperByEmail);
router.post("/myprofile/picture", protectDeveloper, setUserType("developer"), upload.single("profilePicture"), uploadDeveloperProfilePicture);
router.post("/myprofile/changepassword", protectDeveloper, changeDeveloperPassword);
router.delete("/myprofile/delete", protectDeveloper, deleteDeveloper);



export default router;