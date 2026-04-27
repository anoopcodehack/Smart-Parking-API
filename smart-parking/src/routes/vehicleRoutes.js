const express = require("express");
const router = express.Router();
const {
  vehicleEntry,
  vehicleExit,
  getCurrentlyParked,
  getVehicleByPlate,
} = require("../controllers/vehicleController");

// POST /api/vehicles/entry         → Register vehicle entry
router.post("/entry", vehicleEntry);

// POST /api/vehicles/exit          → Register vehicle exit
router.post("/exit", vehicleExit);

// GET  /api/vehicles               → Get all currently parked vehicles
router.get("/", getCurrentlyParked);

// GET  /api/vehicles/:numberPlate  → Get vehicle info by number plate
router.get("/:numberPlate", getVehicleByPlate);

module.exports = router;
