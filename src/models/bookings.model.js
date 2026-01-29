import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    numNights: {
      type: Number,
      min: 1,
      required: true,
    },
    numGuests: {
      type: Number,
      min: 1,
      required: true,
    },
    cabinPrice: {
      type: Number,
      required: true,
    },
    extrasPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["unconfirmed", "checked-in", "checked-out"],
      default: "unconfirmed",
    },
    hasBreakfast: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    observations: {
      type: String,
      default: "",
    },
    cabinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cabin",
      required: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for created_at to match Supabase field name (frontend compatibility)
bookingsSchema.virtual("created_at").get(function () {
  return this.createdAt;
});

// Ensure virtuals are included in JSON output
bookingsSchema.set("toJSON", { virtuals: true });
bookingsSchema.set("toObject", { virtuals: true });

export const Bookings = mongoose.model("Booking", bookingsSchema);
