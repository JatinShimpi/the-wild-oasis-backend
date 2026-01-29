import { Guest } from "../models/guest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createGuest = asyncHandler(async (req, res) => {
    const { fullName, email, nationality, nationalID, countryFlag } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "Full name and email are required");
    }

    // Check if guest already exists
    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
        // Return existing guest instead of error (for OAuth flow)
        return res.status(200).json(new ApiResponse(200, existingGuest, "Guest already exists"));
    }

    const newGuest = await Guest.create({
        fullName,
        email,
        nationality: nationality || "",
        nationalID: nationalID || "",
        countryFlag: countryFlag || "",
    });

    res.status(201).json(new ApiResponse(201, newGuest, "Guest created successfully"));
});

const getGuestByEmail = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if (!email) {
        throw new ApiError(400, "Email query parameter is required");
    }

    const guest = await Guest.findOne({ email });

    // Return null if not found (for OAuth flow - not an error)
    if (!guest) {
        return res.status(200).json(new ApiResponse(200, null, "Guest not found"));
    }

    res.status(200).json(new ApiResponse(200, guest, "Guest fetched successfully"));
});

const getGuestById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const guest = await Guest.findById(id);

    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }

    res.status(200).json(new ApiResponse(200, guest, "Guest fetched successfully"));
});

const getAllGuests = asyncHandler(async (req, res) => {
    const guests = await Guest.find().sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, guests, "Guests fetched successfully"));
});

const updateGuest = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { fullName, nationality, nationalID, countryFlag } = req.body;

    const guest = await Guest.findById(id);
    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }

    // Update fields if provided
    if (fullName) guest.fullName = fullName;
    if (nationality) guest.nationality = nationality;
    if (nationalID) guest.nationalID = nationalID;
    if (countryFlag) guest.countryFlag = countryFlag;

    await guest.save();

    res.status(200).json(new ApiResponse(200, guest, "Guest updated successfully"));
});

const deleteGuest = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const guest = await Guest.findByIdAndDelete(id);

    if (!guest) {
        throw new ApiError(404, "Guest not found");
    }

    res.status(200).json(new ApiResponse(200, null, "Guest deleted successfully"));
});

export {
    createGuest,
    getGuestByEmail,
    getGuestById,
    getAllGuests,
    updateGuest,
    deleteGuest,
};
