import express from "express";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getJobsByLocationController,
  getJobsByTypeController,
} from "../controller/jobController.js";
import { protectRecruiterOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRecruiterOrAdmin, createJobController);
router.get("/all", getAllJobsController);
router.get("/location/:location", getJobsByLocationController);
router.get("/type/:jobType", getJobsByTypeController);
router.delete("/delete/:id", protectRecruiterOrAdmin, deleteJobController);

export default router;
