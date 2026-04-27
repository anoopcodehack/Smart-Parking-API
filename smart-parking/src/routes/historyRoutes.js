const express = require("express");
const router = express.Router();
const {
  getAllHistory,
  getHistoryById,
  clearHistory,
} = require("../controllers/historyController");

// DELETE /api/history/clear  → Clear all history (testing)
router.delete("/clear", clearHistory);

// GET    /api/history        → Get all history (?status=&plate=&page=&limit=)
router.get("/", getAllHistory);

// GET    /api/history/:id    → Get specific history record
router.get("/:id", getHistoryById);

module.exports = router;
