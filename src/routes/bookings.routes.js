import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  checkinBooking,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingsAfterDate,
  getStaysAfterDate,
  getStaysTodayActivity
} from "../controllers/bookings.controller.js";

const router = Router();

router.route("/create-booking").get(verifyJWT, createBooking);
router.route("/get-bookings").get(verifyJWT, getAllBookings);
router.route("/get-bookings-after-date").get(verifyJWT, getBookingsAfterDate);
router.route("/get-stays-after-date").get(verifyJWT, getStaysAfterDate);
router.route("/get-stays-today").get(verifyJWT, getStaysTodayActivity);
router.route("/checkin-booking").post(verifyJWT, checkinBooking);
router.route("/delete-booking").delete(verifyJWT, deleteBooking);

export default router;
