🅿️ Smart Parking Lot API

A scalable RESTful backend system for managing parking lots with automated slot allocation, real-time availability tracking, vehicle lifecycle management, and complete parking history.

Built with a clean architecture and production-ready practices.

🚀 Tech Stack
Runtime: Node.js
Framework: Express.js
Database: MongoDB
ODM: Mongoose
Environment Config: dotenv
Development: nodemon
📁 Project Structure
smart-parking/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config/db.js
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
git clone https://github.com/your-username/smart-parking-api.git
cd smart-parking-api
npm install
cp .env.example .env
Configure .env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart_parking
NODE_ENV=development
Run
npm run dev   # development
npm start     # production

📡 API Overview

Base URL:

http://localhost:3000/api

🔲 Slots
Initialize parking lot
View all / filter slots
Reset system
🚗 Vehicles
Entry → auto slot assignment
Exit → duration calculation
View parked vehicles
Search by number plate
📋 History
Full history tracking
Filter by status or plate
Pagination support
✨ Key Features
Smart nearest-slot allocation
Duplicate vehicle entry prevention
Accurate parking duration tracking
Advanced filtering & search
Pagination for large datasets
Consistent API response structure
Indexed queries for performance
📊 Data Models
ParkingSlot
{
  slotNumber: Number,
  isOccupied: Boolean,
  vehicleNumberPlate: String,
  entryTime: Date
}
ParkingHistory
{
  vehicleNumberPlate: String,
  slotNumber: Number,
  entryTime: Date,
  exitTime: Date,
  durationMinutes: Number,
  status: "PARKED" | "EXITED"
}
🧪 Testing Flow
Initialize slots
Park vehicles
Check occupied slots
Exit vehicle
Verify history
⚠️ Limitations
No authentication system
No payment/billing logic
No real-time updates
No frontend
🔮 Future Improvements
JWT Authentication
Billing system
WebSocket live updates
ANPR integration
React dashboard
📄 License

MIT License

