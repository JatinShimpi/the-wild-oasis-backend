import { Settings } from "../models/settings.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();
  
  if (!settings) {
    throw new ApiError(404, "Settings not found");
  }

  res.status(200).json(new ApiResponse(200, settings));
});

const updateSettings = asyncHandler(async (req, res) => {
  const updates = req.body;
  const settings = await Settings.getSingleton();

  const allowedUpdates = [
    'minBookingLength',
    'maxBookingLength',
    'maxGuestsPerBooking',
    'breakfastPrice'
  ];

  Object.keys(updates).forEach(update => {
    if (allowedUpdates.includes(update)) {
      settings[update] = updates[update];
    }
  });

  await settings.save();

  res.status(200).json(new ApiResponse(200, settings, "Settings updated successfully"));
});

export { getSettings, updateSettings };