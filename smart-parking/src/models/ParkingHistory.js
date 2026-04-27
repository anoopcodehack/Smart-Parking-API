const mongoose = require("mongoose");

const parkingHistorySchema = new mongoose.Schema(
  {
    vehicleNumberPlate: {
      type: String,
      required: [true, "Vehicle number plate is required"],
      uppercase: true,
      trim: true,
    },
    slotNumber: {
      type: Number,
      required: [true, "Slot number is required"],
    },
    entryTime: {
      type: Date,
      required: [true, "Entry time is required"],
    },
    exitTime: {
      type: Date,
      default: null,
    },
    durationMinutes: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["PARKED", "EXITED"],
      default: "PARKED",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for fast lookups
parkingHistorySchema.index({ vehicleNumberPlate: 1 });
parkingHistorySchema.index({ entryTime: -1 });
parkingHistorySchema.index({ status: 1 });

module.exports = mongoose.model("ParkingHistory", parkingHistorySchema);
