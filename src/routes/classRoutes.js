import exress from 'express';
import { protectTeacher } from "../middleware/teacherAuth.js";
import { createNewClass, deleteExistingClass, getAllClasses, updateExistingClass } from '../controller/classController.js';

const router = exress.Router();

router.post("/create", protectTeacher, createNewClass);
router.get("/all", getAllClasses);
router.put("/update/:classId", protectTeacher, updateExistingClass);
router.delete("/delete/:classId", protectTeacher, deleteExistingClass);

export default router;