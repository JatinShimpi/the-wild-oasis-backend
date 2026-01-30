import { Guest } from "../models/guest.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (guestId) => {
    try {
        const guest = await Guest.findById(guestId);
        const accessToken = guest.generateAccessToken();
        const refreshToken = guest.generateRefreshToken();

        guest.refreshToken = refreshToken;
        await guest.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating referesh and access token"
        );
    }
};

const loginGoogle = asyncHandler(async (req, res) => {
    const { fullName, email, nationality, nationalID, countryFlag } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    let guest = await Guest.findOne({ email });

    if (!guest) {
        // Create new guest if not exists
        guest = await Guest.create({
            fullName: fullName || "Guest",
            email,
            nationality: nationality || "",
            nationalID: nationalID || "",
            countryFlag: countryFlag || "",
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        guest._id
    );

    const loggedInGuest = await Guest.findById(guest._id).select("-refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Check NODE_ENV
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    guest: loggedInGuest,
                    accessToken,
                    refreshToken,
                },
                "Guest logged in Successfully"
            )
        );
});

const logoutGuest = asyncHandler(async (req, res) => {
    await Guest.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Guest logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const guest = await Guest.findById(decodedToken?._id);

        if (!guest) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== guest?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(guest._id);

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

// Keep existing CRUD but remove createGuest since loginGoogle handles creation
// actually keep createGuest for manual testing if needed, but loginGoogle is primary.

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
    loginGoogle,
    logoutGuest,
    refreshAccessToken,
};
