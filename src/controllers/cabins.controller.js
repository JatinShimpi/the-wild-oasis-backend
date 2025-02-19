import { Cabin } from "../models/cabins.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createCabin = asyncHandler(async (req, res) => {
  const { cabinImage, capacity, price, discount, description } = req.body;

  if (!cabinImage || !capacity || !price || !description) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const newCabin = await Cabin.create({
    cabinImage,
    capacity,
    price,
    discount,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Cabin created successfully",
    data: newCabin,
  });
});


const getAllCabins = asyncHandler(async (req, res) => {
  const cabins = await Cabin.find();

  res.status(200).json({
    success: true,
    total: cabins.length,
    data: cabins,
  });
});


const getCabinById = asyncHandler(async (req, res) => {
  const cabin = await Cabin.findById(req.params.id);

  if (!cabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json({
    success: true,
    data: cabin,
  });
});


const updateCabin = asyncHandler(async (req, res) => {
  const updatedCabin = await Cabin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updatedCabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json({
    success: true,
    message: "Cabin updated successfully",
    data: updatedCabin,
  });
});


const deleteCabin = asyncHandler(async (req, res) => {
  const deletedCabin = await Cabin.findByIdAndDelete(req.params.id);

  if (!deletedCabin) {
    throw new ApiError(404, "Cabin not found");
  }

  res.status(200).json({
    success: true,
    message: "Cabin deleted successfully",
  });
});

export { createCabin, getAllCabins, getCabinById, updateCabin, deleteCabin };
