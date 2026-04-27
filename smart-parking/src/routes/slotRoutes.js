const express = require("express");
const router = express.Router();
const {
  initializeSlots,
  getAllSlots,
  getSlotByNumber,
  resetParkingLot,
} = require("../controllers/slotController");

// POST   /api/slots/initialize   → Initialize parking lot with N slots
router.post("/initialize", initializeSlots);

// DELETE /api/slots/reset        → Reset entire parking lot
router.delete("/reset", resetParkingLot);

// GET    /api/slots              → Get all slots (?status=available|occupied)
router.get("/", getAllSlots);

// GET    /api/slots/:slotNumber  → Get a specific slot
router.get("/:slotNumber", getSlotByNumber);

module.exports = router;
