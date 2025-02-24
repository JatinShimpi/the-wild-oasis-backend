import { Cabin } from "../models/cabins.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const createCabin = asyncHandler(async (req, res) => {
  const { cabinNum, capacity, price, discount, description } = req.body;

  console.log(cabinNum, capacity, price, discount, description);

  if (!cabinNum || !capacity || !price || !description) {
    throw new ApiError(400, "All required fields must be filled");
  }

  const existedCabin = await Cabin.findOne({ $or: [{ cabinNum }] });
  if (existedCabin) {
    throw new ApiError(409, "cabin already exits");
  }

  const cabinLocalPath = req.files?.cabinImage[0]?.path;

  if (!cabinLocalPath) {
    throw new ApiError(400, "cabin file is required");
  }
  console.log(req.files);

  const cabin = await uploadOnCloudinary(cabinLocalPath);

  const newCabin = await Cabin.create({
    cabinImage: cabin.url,
    cabinNum,
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
  
  let updateData = { ...req.body };

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
    if (existingCabin.cabinImage) {
      const publicId = existingCabin.cabinImage.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Add new image URL to update data
    updateData.cabinImage = cabinImage.url;
  }

  // Ensure there is at least one field to update
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field must be updated");
  }

  // Update the cabin details
  const updatedCabin = await Cabin.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true },
  );

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
