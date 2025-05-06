import express from "express";

import globalSearch from "../controller/searchController.js";

const router = express.Router();

router.get("/suggest", globalSearch);

export default router;
