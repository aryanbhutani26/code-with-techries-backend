import express from "express";
import { protectStudent } from "../middleware/studentAuth.js";
import {
  createFeedbackController,
  deleteFeedbackController,
  getAllFeedbackByCourseIdController,
  updateFeedbackController,
} from "../controller/feedbackController.js";
import { protect_Teacher_Student_Admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protectStudent, createFeedbackController);
router.put("/update/:feedbackId", protectStudent, updateFeedbackController);
router.get("/course/:courseId", getAllFeedbackByCourseIdController);
router.delete("/delete/:feedbackId", protect_Teacher_Student_Admin, deleteFeedbackController);

export default router;
