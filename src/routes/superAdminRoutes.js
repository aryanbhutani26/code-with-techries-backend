import express from "express";
import { protectSuperAdmin } from "../middleware/superAdminAuth.js";
import { createAdmin, loginSuperAdmin } from "../controller/superAdminController.js";

const router = express.Router();

router.post("/login", loginSuperAdmin);
router.post("/create-admin", protectSuperAdmin, createAdmin);

export default router;
