import express from 'express';
import { protectAdmin } from "../middleware/adminAuth.js";
import { createNewClass, deleteExistingClass, getAllClasses, updateExistingClass } from '../controller/classController.js';

const router = express.Router();

router.post("/create", protectAdmin, createNewClass);
router.get("/all", getAllClasses);
router.put("/update/:classId", protectAdmin, updateExistingClass);
router.delete("/delete/:classId", protectAdmin, deleteExistingClass);

export default router;