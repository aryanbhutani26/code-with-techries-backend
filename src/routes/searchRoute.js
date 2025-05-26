import express from "express";

import { globalSearch, jobSearch } from "../controller/searchController.js";

const router = express.Router();

router.get("/suggest", globalSearch);
router.get("/jobs/suggest", jobSearch);

export default router;
