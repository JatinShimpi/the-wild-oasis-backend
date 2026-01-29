import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingAPI,
  deleteBookingAPI,
  checkinBookingAPI,
  checkoutBookingAPI,
  getBookingsAfterDate,
  getStaysAfterDate,
  getStaysTodayActivity,
} from "../controllers/bookings.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createBookingSchema,
  updateBookingSchema,
} from "../validators/common.validator.js";

const router = Router();

// Protected routes
router.use(verifyJWT);

router.route("/").get(getAllBookings).post(validate(createBookingSchema), createBooking);

router
  .route("/:id")
  .get(getBookingById)
  .patch(validate(updateBookingSchema), updateBookingAPI)
  .delete(deleteBookingAPI);

router.route("/check-in/:id").patch(
  validate(updateBookingSchema),
  checkinBookingAPI
);

router.route("/checkout/:id").patch(checkoutBookingAPI);

router.route("/after-date").get(getBookingsAfterDate);
router.route("/stays/after-date").get(getStaysAfterDate);
router.route("/stays/today-activity").get(getStaysTodayActivity);

export default router;
