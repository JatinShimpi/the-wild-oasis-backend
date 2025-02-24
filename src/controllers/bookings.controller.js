import { Bookings } from "../models/bookings.model.js";
import { Guest } from "../models/guest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBooking = asyncHandler(async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      // nationality,
      nationalID,
      countryFlag,
      startDate,
      endDate,
      numNights,
      numGuests,
      cabinPrice,
      extrasPrice,
      // totalPrice,
      status,
      hasBreakfast,
      isPaid,
      observations,
      cabinNum,
    } = req.body;

    // Check for missing fields
    if (
      [
        fullName,
        email,
        // nationality,
        nationalID,
        countryFlag,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        // totalPrice,
        status,
        hasBreakfast,
        isPaid,
        observations,
        cabinNum,
      ].some((field) => field === undefined || field === "" || field === null)
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "All fields are required"));
    }

    // Check if guest already exists
    const existingGuest = await Guest.findOne({ email, nationalID });
    let guestId;

    if (existingGuest) {
      guestId = existingGuest._id;
    } else {
      // Create a new guest if not found
      const newGuest = await Guest.create({
        fullName,
        email,
        nationalID,
        countryFlag,
      });
      guestId = newGuest._id;
    }

    // Check if the cabin is available
    const existingBooking = await Bookings.findOne({
      cabinNum,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
    if (existingBooking) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            "Cabin is already booked for the selected dates",
          ),
        );
    }

    // Create the booking
    const newBooking = await Bookings.create({
      startDate,
      endDate,
      numNights,
      numGuests,
      cabinPrice,
      extrasPrice,
      // totalPrice,
      status,
      hasBreakfast,
      isPaid,
      observations,
      cabinNum,
      guestId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newBooking, "Booking created successfully"));
  } catch (error) {
    throw new ApiError(500, "error while creating new Booking"); // Pass error to the global error handler
  }
});

const getAllBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Bookings.find().populate("guestId");

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

const checkinBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Bookings.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== "confirmed") {
    throw new ApiError(400, "Only confirmed bookings can be checked in");
  }

  booking.status = "checked-in";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking checked in successfully",
    data: booking,
  });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Booking ID is required");
  }

  const booking = await Bookings.findByIdAndDelete(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
});

export { getAllBookings, checkinBooking, deleteBooking, createBooking };
