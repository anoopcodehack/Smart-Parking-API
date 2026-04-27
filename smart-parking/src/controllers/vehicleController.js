const ParkingSlot = require("../models/ParkingSlot");
const ParkingHistory = require("../models/ParkingHistory");
const { sendSuccess, sendError } = require("../utils/response");
const { calculateDuration, formatDuration } = require("../utils/duration");

// ─────────────────────────────────────────────
// POST /api/vehicles/entry
// Register vehicle entry – assign nearest slot
// ─────────────────────────────────────────────
const vehicleEntry = async (req, res) => {
  try {
    const { numberPlate } = req.body;

    if (!numberPlate || typeof numberPlate !== "string" || numberPlate.trim() === "") {
      return sendError(res, 400, "numberPlate is required and must be a non-empty string");
    }

    const plate = numberPlate.trim().toUpperCase();

    // Validate number plate format (basic: alphanumeric + hyphens, 4–12 chars)
    const plateRegex = /^[A-Z0-9-]{2,15}$/;
    if (!plateRegex.test(plate)) {
      return sendError(
        res,
        400,
        "Invalid number plate format. Use alphanumeric characters and hyphens (2-15 chars)"
      );
    }

    // Prevent duplicate entry
    const alreadyParked = await ParkingSlot.findOne({
      vehicleNumberPlate: plate,
      isOccupied: true,
    });
    if (alreadyParked) {
      return sendError(
        res,
        409,
        `Vehicle ${plate} is already parked in Slot #${alreadyParked.slotNumber}`
      );
    }

    // Find nearest available slot (lowest slot number)
    const availableSlot = await ParkingSlot.findOne({ isOccupied: false }).sort({ slotNumber: 1 });

    if (!availableSlot) {
      return sendError(res, 503, "Parking lot is full. No available slots.");
    }

    const entryTime = new Date();

    // Assign slot
    availableSlot.isOccupied = true;
    availableSlot.vehicleNumberPlate = plate;
    availableSlot.entryTime = entryTime;
    await availableSlot.save();

    // Create history record
    const historyRecord = await ParkingHistory.create({
      vehicleNumberPlate: plate,
      slotNumber: availableSlot.slotNumber,
      entryTime,
      status: "PARKED",
    });

    return sendSuccess(res, 201, `Vehicle ${plate} has entered. Assigned Slot #${availableSlot.slotNumber}`, {
      slotNumber: availableSlot.slotNumber,
      vehicleNumberPlate: plate,
      entryTime,
      recordId: historyRecord._id,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// POST /api/vehicles/exit
// Register vehicle exit – release slot
// ─────────────────────────────────────────────
const vehicleExit = async (req, res) => {
  try {
    const { numberPlate } = req.body;

    if (!numberPlate || typeof numberPlate !== "string" || numberPlate.trim() === "") {
      return sendError(res, 400, "numberPlate is required");
    }

    const plate = numberPlate.trim().toUpperCase();

    // Find the occupied slot
    const occupiedSlot = await ParkingSlot.findOne({
      vehicleNumberPlate: plate,
      isOccupied: true,
    });

    if (!occupiedSlot) {
      return sendError(res, 404, `Vehicle ${plate} is not currently parked`);
    }

    const exitTime = new Date();
    const durationMinutes = calculateDuration(occupiedSlot.entryTime, exitTime);
    const durationFormatted = formatDuration(durationMinutes);

    // Update slot – mark as available
    const slotNumber = occupiedSlot.slotNumber;
    const entryTime = occupiedSlot.entryTime;

    occupiedSlot.isOccupied = false;
    occupiedSlot.vehicleNumberPlate = null;
    occupiedSlot.entryTime = null;
    await occupiedSlot.save();

    // Update history record
    await ParkingHistory.findOneAndUpdate(
      { vehicleNumberPlate: plate, status: "PARKED" },
      {
        exitTime,
        durationMinutes,
        status: "EXITED",
      },
      { sort: { entryTime: -1 } }
    );

    return sendSuccess(res, 200, `Vehicle ${plate} has exited from Slot #${slotNumber}`, {
      vehicleNumberPlate: plate,
      slotNumber,
      entryTime,
      exitTime,
      durationMinutes,
      durationFormatted,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/vehicles
// Get all currently parked vehicles
// ─────────────────────────────────────────────
const getCurrentlyParked = async (req, res) => {
  try {
    const parkedSlots = await ParkingSlot.find({ isOccupied: true }).sort({ slotNumber: 1 });

    const vehicles = parkedSlots.map((slot) => ({
      slotNumber: slot.slotNumber,
      vehicleNumberPlate: slot.vehicleNumberPlate,
      entryTime: slot.entryTime,
      parkedDurationMinutes: calculateDuration(slot.entryTime, new Date()),
      parkedDurationFormatted: formatDuration(calculateDuration(slot.entryTime, new Date())),
    }));

    return sendSuccess(res, 200, "Currently parked vehicles retrieved", {
      totalParked: vehicles.length,
      vehicles,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/vehicles/:numberPlate
// Get details of a specific vehicle by number plate
// ─────────────────────────────────────────────
const getVehicleByPlate = async (req, res) => {
  try {
    const plate = req.params.numberPlate.toUpperCase();

    const currentSlot = await ParkingSlot.findOne({
      vehicleNumberPlate: plate,
      isOccupied: true,
    });

    const history = await ParkingHistory.find({ vehicleNumberPlate: plate }).sort({ entryTime: -1 });

    if (!currentSlot && history.length === 0) {
      return sendError(res, 404, `No records found for vehicle ${plate}`);
    }

    const currentStatus = currentSlot
      ? {
          status: "PARKED",
          slotNumber: currentSlot.slotNumber,
          entryTime: currentSlot.entryTime,
          currentDurationMinutes: calculateDuration(currentSlot.entryTime, new Date()),
          currentDurationFormatted: formatDuration(
            calculateDuration(currentSlot.entryTime, new Date())
          ),
        }
      : { status: "NOT PARKED" };

    return sendSuccess(res, 200, `Vehicle ${plate} details retrieved`, {
      vehicleNumberPlate: plate,
      currentStatus,
      totalVisits: history.length,
      history,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  vehicleEntry,
  vehicleExit,
  getCurrentlyParked,
  getVehicleByPlate,
};
