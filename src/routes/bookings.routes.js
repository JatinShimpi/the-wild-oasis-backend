import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getAllBookings } from "../controllers/bookings.controller.js";

const router = Router();

router.route("/getbookings").get(verifyJWT, getAllBookings);

export default router;
