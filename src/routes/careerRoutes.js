import express from "express";
import { createCareerController, getAllCareerController, getCareerByIdController, updateCareerByIdController, deleteCareerByIdController } from "../controller/careerController.js";

const router = express.Router();

// Create a job
router.post("/", createCareerController);

// Get all jobs
router.get("/get", getAllCareerController);

// Get job by ID
router.get("/:id", getCareerByIdController);

// Update a job by ID
router.put("/update/:id", updateCareerByIdController);

// Delete a job by ID
router.delete("/delete/:id", deleteCareerByIdController);

export default router;
