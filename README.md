# 🅿️ Smart Parking Lot API

A production-ready backend REST API for managing parking lots — automated slot allocation, real-time availability tracking, vehicle entry/exit workflow, duration calculation, and complete parking history.

---

## 📦 Tech Stack

| Layer        | Technology            |
|--------------|-----------------------|
| Runtime      | Node.js               |
| Framework    | Express.js            |
| Database     | MongoDB               |
| ODM          | Mongoose              |
| Config       | dotenv                |
| Dev server   | nodemon               |

---

## 🗂️ Project Structure

```
smart-parking/
├── .env                        # Environment variables
├── .env.example                # Template for environment setup
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── server.js               # Entry point — starts server
    ├── app.js                  # Express app, middleware, routes
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── models/
    │   ├── ParkingSlot.js      # Slot schema
    │   └── ParkingHistory.js   # History schema
    ├── controllers/
    │   ├── slotController.js   # Slot CRUD logic
    │   ├── vehicleController.js# Entry/exit logic
    │   └── historyController.js# History retrieval
    ├── routes/
    │   ├── slotRoutes.js
    │   ├── vehicleRoutes.js
    │   └── historyRoutes.js
    ├── middleware/
    │   ├── logger.js           # Custom request logger
    │   └── errorHandler.js     # 404 + global error handler
    └── utils/
        ├── response.js         # Standardized API responses
        └── duration.js         # Duration calculation helpers
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally or MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/your-username/smart-parking-api.git
cd smart-parking-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/smart_parking
NODE_ENV=development
```

### 4. Start the server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:3000`

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

---

### 🔲 Slot Management

#### Initialize Parking Lot
```
POST /api/slots/initialize
```
**Body:**
```json
{ "totalSlots": 50 }
```
**Response:**
```json
{
  "success": true,
  "message": "Parking lot initialized with 50 slots",
  "data": { "totalSlots": 50, "availableSlots": 50, "occupiedSlots": 0 }
}
```

---

#### Get All Slots
```
GET /api/slots
GET /api/slots?status=available
GET /api/slots?status=occupied
```

---

#### Get Slot by Number
```
GET /api/slots/:slotNumber
```

---

#### Reset Parking Lot
```
DELETE /api/slots/reset
```
> ⚠️ Clears all slots AND parking history. Use for testing/demo only.

---

### 🚗 Vehicle Management

#### Vehicle Entry
```
POST /api/vehicles/entry
```
**Body:**
```json
{ "numberPlate": "MH12AB1234" }
```
- Automatically assigns the **nearest available slot** (lowest slot number)
- Prevents duplicate entry
- Records entry time

**Response:**
```json
{
  "success": true,
  "message": "Vehicle MH12AB1234 has entered. Assigned Slot #3",
  "data": {
    "slotNumber": 3,
    "vehicleNumberPlate": "MH12AB1234",
    "entryTime": "2024-06-01T10:30:00.000Z",
    "recordId": "664abc..."
  }
}
```

---

#### Vehicle Exit
```
POST /api/vehicles/exit
```
**Body:**
```json
{ "numberPlate": "MH12AB1234" }
```
- Releases the slot
- Calculates parking duration
- Updates history record

**Response:**
```json
{
  "success": true,
  "message": "Vehicle MH12AB1234 has exited from Slot #3",
  "data": {
    "vehicleNumberPlate": "MH12AB1234",
    "slotNumber": 3,
    "entryTime": "2024-06-01T10:30:00.000Z",
    "exitTime": "2024-06-01T12:45:00.000Z",
    "durationMinutes": 135,
    "durationFormatted": "2 hours 15 minutes"
  }
}
```

---

#### Get Currently Parked Vehicles
```
GET /api/vehicles
```

---

#### Search Vehicle by Number Plate
```
GET /api/vehicles/:numberPlate
```
Returns current parking status + full visit history for that vehicle.

---

### 📋 Parking History

#### Get All History
```
GET /api/history
GET /api/history?status=PARKED
GET /api/history?status=EXITED
GET /api/history?plate=MH12AB1234
GET /api/history?page=1&limit=20
```

---

#### Get History Record by ID
```
GET /api/history/:id
```

---

#### Clear All History
```
DELETE /api/history/clear
```

---

## ✅ Validation Rules

| Field         | Rule                                              |
|---------------|---------------------------------------------------|
| `totalSlots`  | Positive integer, max 1000                        |
| `numberPlate` | Alphanumeric + hyphens, 2–15 characters, required |
| `slotNumber`  | Positive integer, must exist in DB               |
| `status` query| Must be `available` or `occupied`                 |

---

## 🪵 Middleware

### Request Logger (`src/middleware/logger.js`)
Logs every incoming request:
```
[2024-06-01T10:30:00.000Z] POST /api/vehicles/entry - IP: ::1
[2024-06-01T10:30:00.000Z] POST /api/vehicles/entry → STATUS: 201
```

### Error Handler (`src/middleware/errorHandler.js`)
- 404 handler for undefined routes
- Global error handler with stack trace in development

---

## 📊 Data Models

### ParkingSlot
```js
{
  slotNumber: Number,       // unique, 1-based
  isOccupied: Boolean,      // default: false
  vehicleNumberPlate: String, // null when empty
  entryTime: Date           // null when empty
}
```

### ParkingHistory
```js
{
  vehicleNumberPlate: String,
  slotNumber: Number,
  entryTime: Date,
  exitTime: Date,           // null until exit
  durationMinutes: Number,  // null until exit
  status: "PARKED" | "EXITED"
}
```

---

## 🌟 Bonus Features Implemented

- [x] **Nearest slot allocation** — always assigns lowest available slot number
- [x] **Duplicate vehicle prevention** — 409 Conflict response
- [x] **Duration calculation** — minutes + human-readable format
- [x] **Filter by availability** — `?status=available|occupied`
- [x] **Search by number plate** — full history + current status
- [x] **Paginated history** — `?page=1&limit=20`
- [x] **Standardized API responses** — consistent `{ success, message, data }` format
- [x] **Indexed MongoDB queries** — fast lookups on plate, status, entryTime

---

## 🧪 Testing with Postman

Import `postman/Smart_Parking_API.postman_collection.json` into Postman.

**Recommended test flow:**
1. `POST /api/slots/initialize` — create 10 slots
2. `GET /api/slots` — verify all available
3. `POST /api/vehicles/entry` — park 3 vehicles
4. `GET /api/slots?status=occupied` — see occupied slots
5. `GET /api/vehicles` — view parked vehicles
6. `POST /api/vehicles/exit` — exit one vehicle
7. `GET /api/history` — view history with duration
8. `GET /api/vehicles/:plate` — search by plate

---

## ⚠️ Known Limitations

- No authentication / authorization system
- No real-time sensor integration
- No automated billing/payment system
- No number plate recognition (ANPR)
- No frontend dashboard

---

## 🚀 Possible Future Improvements

- JWT-based Admin/User authentication
- Billing system based on parking duration
- WebSocket support for real-time slot updates
- ANPR integration for automated entry
- Live monitoring dashboard (React/Next.js)
- IoT sensor integration

---

## 📄 License

MIT
