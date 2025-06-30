import express from "express";
import {
  addContribution,
  getAllContributions,
  getContributionsByProjectId,
  getTopContributors,
  githubWebhookHandler,
} from "../controller/contributionController.js";
import { protect_Developer_Student } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect_Developer_Student, addContribution);
router.post("/webhook", githubWebhookHandler);
router.get("/top", getTopContributors);
router.get("/all", getAllContributions);
router.get("/project/:projectId", getContributionsByProjectId);

export default router;
