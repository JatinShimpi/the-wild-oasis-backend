import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createGuest,
    getGuestByEmail,
    getGuestById,
    getAllGuests,
    updateGuest,
    deleteGuest,
    loginGoogle,
    logoutGuest,
    refreshAccessToken,
} from "../controllers/guests.controller.js";

const router = Router();

/**
 * @swagger
 * /guests/google-login:
 *   post:
 *     summary: Login/Signup with Google
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               nationality:
 *                 type: string
 *               nationalID:
 *                 type: string
 *               countryFlag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.route("/google-login").post(loginGoogle);

router.route("/logout").post(verifyJWT, logoutGuest);
router.route("/refresh-token").post(refreshAccessToken);

// Public routes (needed for OAuth flow)
router.route("/").get(getGuestByEmail).post(createGuest);

// Protected routes
router.route("/all").get(verifyJWT, getAllGuests);
router.route("/:id").get(getGuestById).patch(updateGuest).delete(verifyJWT, deleteGuest);

export default router;
