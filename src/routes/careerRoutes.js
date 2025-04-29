import express from "express";
import { createCareerController, getAllCareerController, getCareerByIdController, updateCareerByIdController, deleteCareerByIdController } from "../controller/careerController.js";
import { protectAdmin } from "../middleware/adminAuth.js";
import { protectRecruiter } from "../middleware/recruiterAuth.js";

const router = express.Router();

router.post("/create", protectAdmin, protectRecruiter, createCareerController);
router.get("/get", getAllCareerController);
router.get("/career/:id", getCareerByIdController);
router.put("/update/:id", updateCareerByIdController);
router.delete("/delete/:id", protectAdmin, protectRecruiter, deleteCareerByIdController);

export default router;
