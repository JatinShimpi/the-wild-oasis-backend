import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
    },
    nationalID: {
      type: String,
    },
    countryFlag: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Guest = mongoose.model("Guest", GuestSchema);
