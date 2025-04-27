import express from 'express';
import { protectAdmin } from "../middleware/adminAuth.js";
import { protectTeacher } from "../middleware/teacherAuth.js";
import { createNewClass, deleteExistingClass, getAllClasses, updateExistingClass } from '../controller/classController.js';

const router = express.Router();

router.post("/create", protectAdmin, protectTeacher, createNewClass);
router.get("/all", getAllClasses);
router.put("/update/:classId", protectAdmin, protectTeacher, updateExistingClass);
router.delete("/delete/:classId", protectAdmin, protectTeacher, deleteExistingClass);

export default router;