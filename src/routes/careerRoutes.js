import express from "express";
// const careerController = require("../controllers/careerController");
import careerController from "../controller/careerController.js";
const router = express.Router();

// Create a job
router.post("/", careerController.createCareer);

// Get all jobs
router.get("/", careerController.getAllCareers);

// Get job by ID
router.get("/:id", careerController.getCareerById);

// Update a job by ID
router.put("/:id", careerController.updateCareerById);

// Delete a job by ID
router.delete("/:id", careerController.deleteCareerById);

export default router;
