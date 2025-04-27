import express from "express";
import { createCareerController, getAllCareerController, getCareerByIdController, updateCareerByIdController, deleteCareerByIdController } from "../controller/careerController.js";

const router = express.Router();

router.post("/", createCareerController);
router.get("/get", getAllCareerController);
router.get("/:id", getCareerByIdController);
router.put("/update/:id", updateCareerByIdController);
router.delete("/delete/:id", deleteCareerByIdController);

export default router;
