🅿️ Smart Parking Lot API
A scalable RESTful backend system for managing parking lots with automated slot allocation, real-time availability tracking, vehicle lifecycle management, and complete parking history. Built with clean architecture and production-ready practices.

🚀 Tech Stack
LayerTechnologyRuntimeNode.jsFrameworkExpress.jsDatabaseMongoDBODMMongooseEnvironment ConfigdotenvDevelopmentnodemon

smart-parking/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── .env
├── .env.example
├── package.json
└── README.md

⚙️ Setup
1. Clone the repository
bashgit clone https://github.com/your-username/smart-parking-api.git
cd smart-parking-api
2. Install dependencies
bashnpm install
3. Configure environment
bashcp .env.example .env
Edit .env with your values:
envPORT=3000
MONGODB_URI=mongodb://localhost:27017/smart_parking
NODE_ENV=development
4. Run the server
bashnpm run dev     # Development (with nodemon)
npm start       # Production

📡 API Overview
Base URL: http://localhost:3000/api
🔲 Slots
MethodEndpointDescriptionPOST/slots/initializeInitialize the parking lotGET/slotsView all slots (with filters)DELETE/slots/resetReset the entire system
🚗 Vehicles
MethodEndpointDescriptionPOST/vehicles/entryVehicle entry — auto slot assignmentPOST/vehicles/exitVehicle exit — duration calculationGET/vehiclesView all currently parked vehiclesGET/vehicles/search?plate=Search by number plate
📋 History
MethodEndpointDescriptionGET/historyFull parking historyGET/history?status=Filter by statusGET/history?plate=Filter by number plateGET/history?page=&limit=Paginated results

✨ Key Features

Smart Slot Allocation — Automatically assigns the nearest available slot
Duplicate Prevention — Blocks re-entry of an already-parked vehicle
Duration Tracking — Accurate parking time calculation on exit
Advanced Filtering — Search and filter across slots, vehicles, and history
Pagination — Efficient handling of large datasets
Consistent Responses — Uniform API response structure throughout
Indexed Queries — MongoDB indexes for high-performance lookups


📊 Data Models
ParkingSlot
js{
  slotNumber: Number,
  isOccupied: Boolean,
  vehicleNumberPlate: String,
  entryTime: Date
}
ParkingHistory
js{
  vehicleNumberPlate: String,
  slotNumber: Number,
  entryTime: Date,
  exitTime: Date,
  durationMinutes: Number,
  status: "PARKED" | "EXITED"
}

🧪 Testing Flow

Initialize the parking lot with slots
Park one or more vehicles
Check currently occupied slots
Exit a vehicle
Verify the parking history


⚠️ Limitations

No authentication or authorization system
No payment or billing logic
No real-time updates (WebSocket/SSE)
No frontend interface


📄 License
MIT License — free to use, modify, and distribute.
