const express = require("express");
const app = express();

// ── Core middleware ──────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Custom request logger middleware ─────────
const logger = require("./middleware/logger");
app.use(logger);

// ── Health check ─────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🅿️  Smart Parking Lot API is running",
    version: "1.0.0",
    endpoints: {
      slots: "/api/slots",
      vehicles: "/api/vehicles",
      history: "/api/history",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime(), timestamp: new Date() });
});

// ── API Routes ────────────────────────────────
app.use("/api/slots", require("./routes/slotRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/history", require("./routes/historyRoutes"));

// ── Error handlers ────────────────────────────
const { notFound, errorHandler } = require("./middleware/errorHandler");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
