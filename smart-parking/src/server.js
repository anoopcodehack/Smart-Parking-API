require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("\n🚀 ═══════════════════════════════════════════");
    console.log(`   Smart Parking Lot API`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log("═══════════════════════════════════════════\n");
    console.log("📌 Available Endpoints:");
    console.log(`   POST   /api/slots/initialize`);
    console.log(`   GET    /api/slots`);
    console.log(`   GET    /api/slots/:slotNumber`);
    console.log(`   DELETE /api/slots/reset`);
    console.log(`   POST   /api/vehicles/entry`);
    console.log(`   POST   /api/vehicles/exit`);
    console.log(`   GET    /api/vehicles`);
    console.log(`   GET    /api/vehicles/:numberPlate`);
    console.log(`   GET    /api/history`);
    console.log(`   GET    /api/history/:id`);
    console.log(`   DELETE /api/history/clear\n`);
  });
};

startServer();
