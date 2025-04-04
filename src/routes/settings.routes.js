import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const router = Router();

router.route("/")
  .get(verifyJWT, getSettings)
  .patch(verifyJWT, updateSettings);

export default router;