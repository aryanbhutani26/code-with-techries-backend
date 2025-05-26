import express from "express";
import {
  createJobController,
  deleteJobController,
  getAllJobsController,
  getJobsByLocationController,
  getJobsByTypeController,
} from "../controller/jobController.js";

const router = express.Router();

router.post("/create", createJobController);
router.get("/all", getAllJobsController);
router.get("/location/:location", getJobsByLocationController);
router.get("/type/:jobType", getJobsByTypeController);
router.delete("/delete/:id", deleteJobController);

export default router;
