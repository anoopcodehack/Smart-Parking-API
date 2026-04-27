const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: {
      type: Number,
      required: [true, "Slot number is required"],
      unique: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    vehicleNumberPlate: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    entryTime: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Index for fast queries on availability
parkingSlotSchema.index({ isOccupied: 1, slotNumber: 1 });

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);
