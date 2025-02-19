import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkinBooking, createBooking, deleteBooking, getAllBookings } from "../controllers/bookings.controller.js";

const router = Router();

router.route("/createbooking").get(verifyJWT, createBooking);
router.route("/getbookings").get(verifyJWT, getAllBookings);
router.route("/checkinbooking").post(verifyJWT, checkinBooking)
router.route("/deletebooking").delete(verifyJWT, deleteBooking)

export default router;
