import { Bookings } from "../models/bookings.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBooking = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    nationality,
    nationalID,
    countryFlag,
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
    cabinId,
  } = req.body;

  // Create a new guest
  const newGuest = await Guest.create({
    fullName,
    email,
    nationality,
    nationalID,
    countryFlag,
  });

  // Create the booking with the guest's ObjectId
  const newBooking = await Bookings.create({
    startDate,
    endDate,
    numNights,
    numGuests,
    cabinPrice,
    extrasPrice,
    totalPrice,
    status,
    hasBreakfast,
    isPaid,
    observations,
    cabinId,
    guestId: newGuest._id, // Reference to the created guest
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: newBooking,
  });
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
