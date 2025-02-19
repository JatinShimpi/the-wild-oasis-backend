import { Bookings } from "../models/bookings.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Bookings.populate("guest");

    const totalBookings = Bookings.countDocuments();

    return res.status(200).json({
      success: true,
      total: totalBookings,
      data: bookings,
    });
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "error while fetching the bookings"));
  }
});

export { getAllBookings };
