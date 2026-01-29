import { Bookings } from "../models/bookings.model.js";
import { Guest } from "../models/guest.model.js";
import { Cabin } from "../models/cabins.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const PAGE_SIZE = 10;

// Helper to get today's date at midnight
const getToday = (options = {}) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (options.end) {
    today.setUTCHours(23, 59, 59, 999);
  }
  return today;
};

const createBooking = asyncHandler(async (req, res) => {
  const {
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
    guestId,
  } = req.body;

  // Validate required fields
  if (!startDate || !endDate || !numNights || !numGuests || !cabinId || !guestId) {
    throw new ApiError(400, "Missing required booking fields");
  }

  // Check if cabin exists
  const cabin = await Cabin.findById(cabinId);
  if (!cabin) {
    throw new ApiError(404, "Cabin not found");
  }

  // Check if guest exists
  const guest = await Guest.findById(guestId);
  if (!guest) {
    throw new ApiError(404, "Guest not found");
  }

  // Check for overlapping bookings
  const existingBooking = await Bookings.findOne({
    cabinId,
    $or: [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) },
      },
    ],
    status: { $ne: "checked-out" },
  });

  if (existingBooking) {
    throw new ApiError(400, "Cabin is already booked for the selected dates");
  }

  const newBooking = await Bookings.create({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    numNights,
    numGuests,
    cabinPrice: cabinPrice || cabin.regularPrice * numNights,
    extrasPrice: extrasPrice || 0,
    totalPrice: totalPrice || (cabinPrice || cabin.regularPrice * numNights) + (extrasPrice || 0),
    status: status || "unconfirmed",
    hasBreakfast: hasBreakfast || false,
    isPaid: isPaid || false,
    observations: observations || "",
    cabinId,
    guestId,
  });

  const populatedBooking = await Bookings.findById(newBooking._id)
    .populate("cabinId", "name image")
    .populate("guestId", "fullName email");

  res.status(201).json(new ApiResponse(201, populatedBooking, "Booking created successfully"));
});

const getAllBookings = asyncHandler(async (req, res) => {
  const { status, sortBy, page = 1 } = req.query;

  // Build query
  const query = {};

  // Status filter
  if (status && status !== "all") {
    query.status = status;
  }

  // Sorting
  let sortOptions = { createdAt: -1 }; // Default: newest first
  if (sortBy) {
    const [field, direction] = sortBy.split("-");
    sortOptions = { [field]: direction === "asc" ? 1 : -1 };
  }

  // Pagination
  const skip = (Number(page) - 1) * PAGE_SIZE;

  const [bookings, total] = await Promise.all([
    Bookings.find(query)
      .populate("cabinId", "name")
      .populate("guestId", "fullName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(PAGE_SIZE),
    Bookings.countDocuments(query),
  ]);

  // Transform for frontend compatibility
  const transformedBookings = bookings.map((booking) => ({
    ...booking.toObject(),
    id: booking._id,
    cabins: booking.cabinId ? { name: booking.cabinId.name } : null,
    guests: booking.guestId
      ? { fullName: booking.guestId.fullName, email: booking.guestId.email }
      : null,
  }));

  res.status(200).json(new ApiResponse(200, { data: transformedBookings, count: total }));
});

const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Bookings.findById(id)
    .populate("cabinId")
    .populate("guestId");

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Transform for frontend compatibility
  const transformedBooking = {
    ...booking.toObject(),
    id: booking._id,
    cabins: booking.cabinId,
    guests: booking.guestId,
  };

  res.status(200).json(new ApiResponse(200, transformedBooking));
});

const getBookingsAfterDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date query parameter is required");
  }

  const bookings = await Bookings.find({
    createdAt: { $gte: new Date(date), $lte: getToday({ end: true }) },
  }).select("createdAt totalPrice extrasPrice");

  // Transform for frontend compatibility
  const transformedBookings = bookings.map((b) => ({
    created_at: b.createdAt,
    totalPrice: b.totalPrice,
    extrasPrice: b.extrasPrice,
  }));

  res.status(200).json(new ApiResponse(200, transformedBookings));
});

const getStaysAfterDate = asyncHandler(async (req, res) => {
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, "Date query parameter is required");
  }

  const stays = await Bookings.find({
    startDate: { $gte: new Date(date), $lte: getToday() },
  }).populate("guestId", "fullName");

  // Transform for frontend compatibility
  const transformedStays = stays.map((stay) => ({
    ...stay.toObject(),
    id: stay._id,
    guests: stay.guestId ? { fullName: stay.guestId.fullName } : null,
  }));

  res.status(200).json(new ApiResponse(200, transformedStays));
});

const getStaysTodayActivity = asyncHandler(async (req, res) => {
  const today = getToday();
  const todayStr = today.toISOString().split("T")[0];

  const activities = await Bookings.find({
    $or: [
      // Arriving today (unconfirmed bookings starting today)
      {
        status: "unconfirmed",
        startDate: {
          $gte: new Date(todayStr),
          $lt: new Date(new Date(todayStr).getTime() + 24 * 60 * 60 * 1000),
        },
      },
      // Departing today (checked-in bookings ending today)
      {
        status: "checked-in",
        endDate: {
          $gte: new Date(todayStr),
          $lt: new Date(new Date(todayStr).getTime() + 24 * 60 * 60 * 1000),
        },
      },
    ],
  })
    .populate("guestId", "fullName nationality countryFlag")
    .sort({ createdAt: 1 });

  // Transform for frontend compatibility
  const transformedActivities = activities.map((activity) => ({
    ...activity.toObject(),
    id: activity._id,
    guests: activity.guestId
      ? {
        fullName: activity.guestId.fullName,
        nationality: activity.guestId.nationality,
        countryFlag: activity.guestId.countryFlag,
      }
      : null,
  }));

  res.status(200).json(new ApiResponse(200, transformedActivities));
});

const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const booking = await Bookings.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Apply updates
  const allowedUpdates = [
    "status",
    "hasBreakfast",
    "isPaid",
    "observations",
    "numGuests",
    "extrasPrice",
    "totalPrice",
  ];

  Object.keys(updates).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      booking[key] = updates[key];
    }
  });

  await booking.save();

  const updatedBooking = await Bookings.findById(id)
    .populate("cabinId")
    .populate("guestId");

  res.status(200).json(new ApiResponse(200, updatedBooking, "Booking updated successfully"));
});

const checkinBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { hasBreakfast, extrasPrice, totalPrice } = req.body;

  const booking = await Bookings.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== "unconfirmed") {
    throw new ApiError(400, "Only unconfirmed bookings can be checked in");
  }

  booking.status = "checked-in";
  booking.isPaid = true;

  // Handle optional breakfast addition
  if (hasBreakfast !== undefined) {
    booking.hasBreakfast = hasBreakfast;
  }
  if (extrasPrice !== undefined) {
    booking.extrasPrice = extrasPrice;
  }
  if (totalPrice !== undefined) {
    booking.totalPrice = totalPrice;
  }

  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, "Booking checked in successfully"));
});

const checkoutBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Bookings.findById(id);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== "checked-in") {
    throw new ApiError(400, "Only checked-in bookings can be checked out");
  }

  booking.status = "checked-out";
  await booking.save();

  res.status(200).json(new ApiResponse(200, booking, "Booking checked out successfully"));
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Bookings.findByIdAndDelete(id);

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  res.status(200).json(new ApiResponse(200, null, "Booking deleted successfully"));
});

export {
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
};
