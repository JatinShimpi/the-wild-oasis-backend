import { Cabin } from "../models/cabins.model.js";
import { Bookings } from "../models/bookings.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { eachDayOfInterval } from "date-fns";

const createCabin = asyncHandler(async (req, res) => {
  const { name, maxCapacity, regularPrice, discount, description } = req.body;

  if (!name || !maxCapacity || !regularPrice || !description) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const existedCabin = await Cabin.findOne({ name });
  if (existedCabin) {
    throw new ApiError(409, "Cabin with this name already exists");
  }

  const cabinLocalPath = req.files?.image?.[0]?.path;

  if (!cabinLocalPath) {
    throw new ApiError(400, "Cabin image is required");
  }

  const cabinImage = await uploadOnCloudinary(cabinLocalPath);

  const newCabin = await Cabin.create({
    name,
    maxCapacity: Number(maxCapacity),
    regularPrice: Number(regularPrice),
    discount: Number(discount) || 0,
    description,
    image: cabinImage.url,
  });

  res.status(201).json(new ApiResponse(201, newCabin, "Cabin created successfully"));
});

const getAllCabins = asyncHandler(async (req, res) => {
  const cabins = await Cabin.find().sort({ name: 1 });

  res.status(200).json(new ApiResponse(200, cabins, "Cabins fetched successfully"));
});

const getCabinById = asyncHandler(async (req, res) => {
  const cabin = await Cabin.findById(req.params.id);

  if (!cabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json(new ApiResponse(200, cabin, "Cabin fetched successfully"));
});

const getCabinPrice = asyncHandler(async (req, res) => {
  const cabin = await Cabin.findById(req.params.id).select("regularPrice discount");

  if (!cabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json(new ApiResponse(200, cabin, "Cabin price fetched successfully"));
});

const getBookedDatesByCabinId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Get all bookings for this cabin that are current or future
  const bookings = await Bookings.find({
    cabinId: id,
    $or: [
      { startDate: { $gte: today } },
      { status: "checked-in" }
    ]
  });

  // Convert to array of all booked dates
  const bookedDates = bookings
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  res.status(200).json(new ApiResponse(200, bookedDates, "Booked dates fetched successfully"));
});

const updateCabin = asyncHandler(async (req, res) => {
  const { name, maxCapacity, regularPrice, discount, description } = req.body;

  let updateData = {};

  if (name) updateData.name = name;
  if (maxCapacity) updateData.maxCapacity = Number(maxCapacity);
  if (regularPrice) updateData.regularPrice = Number(regularPrice);
  if (discount !== undefined) updateData.discount = Number(discount);
  if (description) updateData.description = description;

  // Handle image upload if a new file is provided
  if (req.file?.path) {
    const cabinImage = await uploadOnCloudinary(req.file.path);

    if (!cabinImage.url) {
      throw new ApiError(400, "Error while uploading cabin image");
    }

    // Fetch the existing cabin details to get the old image URL
    const existingCabin = await Cabin.findById(req.params.id);
    if (!existingCabin) {
      throw new ApiError(404, "Cabin not found");
    }

    // Delete old image if it exists
    if (existingCabin.image) {
      const publicId = existingCabin.image.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    updateData.image = cabinImage.url;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field must be updated");
  }

  const updatedCabin = await Cabin.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true }
  );

  if (!updatedCabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json(new ApiResponse(200, updatedCabin, "Cabin updated successfully"));
});

const deleteCabin = asyncHandler(async (req, res) => {
  const cabin = await Cabin.findById(req.params.id);

  if (!cabin) {
    throw new ApiError(404, "Cabin not found");
  }

  // Delete image from Cloudinary
  if (cabin.image) {
    const publicId = cabin.image.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await Cabin.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "Cabin deleted successfully"));
});

export {
  createCabin,
  getAllCabins,
  getCabinById,
  getCabinPrice,
  getBookedDatesByCabinId,
  updateCabin,
  deleteCabin
};
