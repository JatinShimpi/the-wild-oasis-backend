import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const router = Router();

// Public routes (settings needed by customer website)
router.route("/").get(getSettings);

// Protected routes (admin only)
router.route("/").patch(verifyJWT, updateSettings);

export default router;