import express from "express";
import {
  createCourseController,
  deleteCourseController,
  getCourseByIdController,
  getCourseByTitleController,
  getCoursesByInstructorController,
  updateCourseController,
} from "../controller/courseController.js";
import { protectTeacherOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectTeacherOrAdmin, createCourseController);
router.get("/:courseId", getCourseByIdController);
router.get("/title/:title", getCourseByTitleController);
router.get("/instructor/:instructorName", getCoursesByInstructorController);
router.put("/update/:courseId", protectTeacherOrAdmin, updateCourseController);
router.delete("/delete/:courseId", protectTeacherOrAdmin, deleteCourseController);

export default router;
