import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsAfterDate,
  getStaysAfterDate,
  getStaysTodayActivity,
  updateBooking,
  checkinBooking,
  checkoutBooking,
  deleteBooking,
} from "../controllers/bookings.controller.js";

const router = Router();

// Public routes (none for bookings)

// Protected routes
router.route("/").get(verifyJWT, getAllBookings).post(verifyJWT, createBooking);
router.route("/after-date").get(verifyJWT, getBookingsAfterDate);
router.route("/stays-after-date").get(verifyJWT, getStaysAfterDate);
router.route("/today-activity").get(verifyJWT, getStaysTodayActivity);
router.route("/:id").get(verifyJWT, getBookingById).patch(verifyJWT, updateBooking).delete(verifyJWT, deleteBooking);
router.route("/:id/checkin").patch(verifyJWT, checkinBooking);
router.route("/:id/checkout").patch(verifyJWT, checkoutBooking);

export default router;
