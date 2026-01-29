import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
    createGuest,
    getGuestByEmail,
    getGuestById,
    getAllGuests,
    updateGuest,
    deleteGuest,
} from "../controllers/guests.controller.js";

const router = Router();

// Public routes (needed for OAuth flow)
router.route("/").get(getGuestByEmail).post(createGuest);

// Protected routes
router.route("/all").get(verifyJWT, getAllGuests);
router.route("/:id").get(getGuestById).patch(updateGuest).delete(verifyJWT, deleteGuest);

export default router;
