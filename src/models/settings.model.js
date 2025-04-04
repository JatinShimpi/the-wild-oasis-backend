import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  minBookingLength: {
    type: Number,
    required: true,
    min: 1,
    default: 7
  },
  maxBookingLength: {
    type: Number,
    required: true,
    min: 1,
    default: 90
  },
  maxGuestsPerBooking: {
    type: Number,
    required: true,
    min: 1,
    default: 8
  },
  breakfastPrice: {
    type: Number,
    required: true,
    min: 0,
    default: 15
  }
}, { 
  timestamps: true,
  // Ensure only one settings document exists
  statics: {
    async getSingleton() {
      let settings = await this.findOne();
      if (!settings) {
        settings = await this.create({});
      }
      return settings;
    }
  }
});

export const Settings = mongoose.model('Settings', settingsSchema);