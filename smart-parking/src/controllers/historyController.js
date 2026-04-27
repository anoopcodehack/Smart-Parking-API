const ParkingHistory = require("../models/ParkingHistory");
const { sendSuccess, sendError } = require("../utils/response");

// ─────────────────────────────────────────────
// GET /api/history
// Get all parking history sorted by entry time (newest first)
// Optional: ?status=PARKED|EXITED&plate=XX00XX
// ─────────────────────────────────────────────
const getAllHistory = async (req, res) => {
  try {
    const { status, plate, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (status) {
      const s = status.toUpperCase();
      if (!["PARKED", "EXITED"].includes(s)) {
        return sendError(res, 400, "status must be 'PARKED' or 'EXITED'");
      }
      filter.status = s;
    }

    if (plate) {
      filter.vehicleNumberPlate = plate.toUpperCase();
    }

    const limitNum = Math.min(parseInt(limit) || 50, 200);
    const skip = (parseInt(page) - 1) * limitNum;

    const [records, total] = await Promise.all([
      ParkingHistory.find(filter).sort({ entryTime: -1 }).skip(skip).limit(limitNum),
      ParkingHistory.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Parking history retrieved", {
      total,
      page: parseInt(page),
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      records,
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/history/:id
// Get a specific history record by ID
// ─────────────────────────────────────────────
const getHistoryById = async (req, res) => {
  try {
    const record = await ParkingHistory.findById(req.params.id);
    if (!record) {
      return sendError(res, 404, "History record not found");
    }
    return sendSuccess(res, 200, "Record retrieved", { record });
  } catch (error) {
    if (error.name === "CastError") {
      return sendError(res, 400, "Invalid record ID format");
    }
    return sendError(res, 500, error.message);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/history/clear
// Clear all history records (testing/demo)
// ─────────────────────────────────────────────
const clearHistory = async (req, res) => {
  try {
    const result = await ParkingHistory.deleteMany({});
    return sendSuccess(res, 200, `${result.deletedCount} history records cleared`);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = {
  getAllHistory,
  getHistoryById,
  clearHistory,
};
