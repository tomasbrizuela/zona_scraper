import { Router } from "express";
import { getHouseData } from "../controllers/scrape.controller.js";

const router = Router();

router.post("/", getHouseData)

export default router;