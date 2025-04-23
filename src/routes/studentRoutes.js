import express from "express";
import { register, login, getMyProfile } from "../controller/studentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/myprofile", protect, getMyProfile);

export default router;