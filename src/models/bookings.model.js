import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema(
  {
    created_at: {
      type: Date,
      default: Date.now,
    },
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
      min: 0,
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
      required: true,
    },
    // totalPrice: {
    //   type: Number,
    //   required: true,
    // },
    status: {
      type: String,
      required: true,
      enum: ["unconfirmed", "confirmed", "cancelled"], // adjust enum values as needed
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
    cabinNum: {
      type: Number,
      required: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Guest
      ref: "Guest",
      required: true,
    },
    countryFlag:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  },
);

export const Bookings = mongoose.model("Booking", bookingsSchema);
