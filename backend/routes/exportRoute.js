import express from "express";
import { exportMineReport ,exportAllData} from "../controllers/exportController.js";

const router =express.Router();

router.get("/mine/:mineName",exportMineReport);
router.get("/all", exportAllData);

export default router;