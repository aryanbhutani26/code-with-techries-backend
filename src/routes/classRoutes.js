import express from "express";
import { createClass, requestClassUpdate, approveClassUpdate, rejectClassUpdate, getAllClasses, deleteClass } from "../controller/classController.js";
import { protectTeacher } from "../middleware/teacherAuth.js";
import { protectAdmin } from "../middleware/adminAuth.js"; 

const router = express.Router();


router.post("/create", protectAdmin, createClass);
router.put("/requestupdate/:id", protectTeacher, requestClassUpdate);
router.put("/approveupdate/:id", protectAdmin, approveClassUpdate);
router.put("/rejectupdate/:id", protectAdmin, rejectClassUpdate);
router.get("/all", getAllClasses);
router.delete("/delete/:id", protectAdmin, deleteClass);

export default router;
