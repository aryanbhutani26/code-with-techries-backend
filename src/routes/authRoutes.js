import express from "express";
import { loginUser } from "../controller/authController.js"; // Import new login function

const router = express.Router();

router.post("/login", loginUser); // Create a single login endpoint

export default router;
