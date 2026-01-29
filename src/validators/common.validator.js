import { z } from "zod";
import mongoose from "mongoose";

const objectId = z.string().custom((val) => {
    return mongoose.Types.ObjectId.isValid(val);
}, "Invalid ObjectId");

// --- Guest Validators ---
export const createGuestSchema = z.object({
    body: z.object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email"),
        nationality: z.string().optional(),
        nationalID: z.string().optional(),
        countryFlag: z.string().optional(),
    }),
});

export const updateGuestSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        nationality: z.string().optional(),
        nationalID: z.string().optional(),
        countryFlag: z.string().optional(),
    }),
});

// --- Booking Validators ---
export const createBookingSchema = z.object({
    body: z.object({
        cabinId: objectId,
        guestId: objectId,
        startDate: z.string().datetime({ offset: true }).or(z.string()), // Accept ISO string
        endDate: z.string().datetime({ offset: true }).or(z.string()),
        numNights: z.number().int().positive(),
        numGuests: z.number().int().positive(),
        cabinPrice: z.number().positive(),
        extrasPrice: z.number().nonnegative().optional(),
        totalPrice: z.number().positive(),
        status: z.enum(["unconfirmed", "checked-in", "checked-out"]).optional(),
        hasBreakfast: z.boolean().optional(),
        isPaid: z.boolean().optional(),
        observations: z.string().optional(),
    }),
});

export const updateBookingSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        status: z.enum(["unconfirmed", "checked-in", "checked-out"]).optional(),
        isPaid: z.boolean().optional(),
        hasBreakfast: z.boolean().optional(),
        observations: z.string().optional(),
        numGuests: z.number().int().positive().optional(),
    }),
});

// --- Cabin Validators ---
export const createCabinSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        maxCapacity: z.coerce.number().int().positive(),
        regularPrice: z.coerce.number().positive(),
        discount: z.coerce.number().nonnegative().default(0),
        description: z.string().optional(),
        image: z.string().optional(),
    }),
});

export const updateCabinSchema = z.object({
    params: z.object({ id: objectId }),
    body: z.object({
        name: z.string().optional(),
        maxCapacity: z.coerce.number().int().positive().optional(),
        regularPrice: z.coerce.number().positive().optional(),
        discount: z.coerce.number().nonnegative().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
    }),
});
