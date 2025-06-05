import express from "express";
import { protectDeveloperOrAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createProjectController,
  deleteProjectController,
  getAllProjectsController,
  getProjectByIdController,
  getProjectsByTechStackController,
  updateProjectController,
  uploadProjectImagesController,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/create", protectDeveloperOrAdmin, createProjectController);
router.delete("/delete/:id", protectDeveloperOrAdmin, deleteProjectController);
router.get("/all", getAllProjectsController);
router.get("/techstack/:tech", getProjectsByTechStackController);
router.get("/:id", getProjectByIdController);
router.put("/update/:id", protectDeveloperOrAdmin, updateProjectController);
router.post(
  '/:projectId/upload-images',
  (req, res, next) => {
    req.userType = 'projects';
    next();
  },
  upload.array('images', 5), // Accept up to 5 images
  uploadProjectImagesController
);


export default router;
