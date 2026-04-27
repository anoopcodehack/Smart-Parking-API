const ParkingSlot = require("../models/ParkingSlot");
const ParkingHistory = require("../models/ParkingHistory");
const { sendSuccess, sendError } = require("../utils/response");

// ─────────────────────────────────────────────
// POST /api/slots/initialize
// Initialize parking lot with N slots
// ─────────────────────────────────────────────
const initializeSlots = async (req, res) => {
  try {
    const { totalSlots } = req.body;

    if (!totalSlots || typeof totalSlots !== "number" || totalSlots < 1) {
      return sendError(res, 400, "totalSlots must be a positive integer");
    }
    if (totalSlots > 1000) {
      return sendError(res, 400, "totalSlots cannot exceed 1000");
    }

    const existing = await ParkingSlot.countDocuments();
    if (existing > 0) {
      return sendError(
        res,
        400,
        `Parking lot already initialized with ${existing} slots. Reset first to reinitialize.`
      );
    }

    const slots = Array.from({ length: totalSlots }, (_, i) => ({
      slotNumber: i + 1,
      isOccupied: false,
      vehicleNumberPlate: null,
      entryTime: null,
    }));

    await ParkingSlot.insertMany(slots);

    return sendSuccess(res, 201, `Parking lot initialized with ${totalSlots} slots`, {
      totalSlots,
      availableSlots: totalSlots,
      occupiedSlots: 0,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/slots
// Get all slots with optional ?status=available|occupied
// ─────────────────────────────────────────────
const getAllSlots = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === "available") filter.isOccupied = false;
    else if (status === "occupied") filter.isOccupied = true;
    else if (status) {
      return sendError(res, 400, "status query must be 'available' or 'occupied'");
    }

    const slots = await ParkingSlot.find(filter).sort({ slotNumber: 1 });
    const total = await ParkingSlot.countDocuments();
    const occupied = await ParkingSlot.countDocuments({ isOccupied: true });

    return sendSuccess(res, 200, "Slots retrieved successfully", {
      totalSlots: total,
      availableSlots: total - occupied,
      occupiedSlots: occupied,
      slots,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/slots/:slotNumber
// Get a specific slot by number
// ─────────────────────────────────────────────
const getSlotByNumber = async (req, res) => {
  try {
    const slotNumber = parseInt(req.params.slotNumber);

    if (isNaN(slotNumber) || slotNumber < 1) {
      return sendError(res, 400, "slotNumber must be a positive integer");
    }

    const slot = await ParkingSlot.findOne({ slotNumber });
    if (!slot) {
      return sendError(res, 404, `Slot #${slotNumber} not found`);
    }

    return sendSuccess(res, 200, "Slot retrieved successfully", { slot });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/slots/reset
// Reset entire parking lot (clear all slots & history)
// ─────────────────────────────────────────────
const resetParkingLot = async (req, res) => {
  try {
    await ParkingSlot.deleteMany({});
    await ParkingHistory.deleteMany({});

    return sendSuccess(res, 200, "Parking lot has been reset. All slots and history cleared.");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  initializeSlots,
  getAllSlots,
  getSlotByNumber,
  resetParkingLot,
};
