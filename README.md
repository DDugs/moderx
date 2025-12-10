# 🏥 Patient Record Management System

> A robust, secure, and concurrent backend system for managing hospital patient records.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.17-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v13+-336791.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

This system allows hospitals to manage patient data securely. It distinguishes between **Admin** operations (creating/updating profiles) and **Doctor** operations (diagnosing/prescribing). 

**Key Features:**
- **Role-Based Access Control**: Strict separation between Admin and Doctor capabilities.
- **Optimistic Concurrency Control**: Prevents data loss when multiple staff members edit a record simultaneously.
- **Auto-Archiving**: Background jobs automatically archive old visit records to maintain performance.
- **Production Ready**: Configured for deployment on platforms like Render or Vercel.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL Database

### 1. Clone & Install
```bash
git clone <repository-url>
cd moderx
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DB_NAME=patient_record_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_DIALECT=postgres

# Server Port
PORT=3000

# (Optional) For Production
# DATABASE_URL=postgres://user:pass@host:port/dbname
```

### 3. Initialize Database
Run the helper script to create the database (ensure your Postgres server is running):
```bash
node scripts/initDb.js
```

### 4. Run the Server
```bash
# Development Mode (with hot-reload)
npm run dev

# Production Mode
npm start
```

---

## 📡 API Documentation

You can import the full API collection into Postman using the file included in this repo:
`postman_collection.json`

### Authentication
This system uses **Role-Based Headers** for simplicity (simulating an Auth gateway).
- **Admin Access**: `X-User-Role: admin`
- **Doctor Access**: `X-User-Role: doctor`

### Endpoints

#### 👤 Patient Management (Admin Only)

| Method | Endpoint         | Description                   | Request Body (JSON) |
| :----- | :--------------- | :---------------------------- | :------------------ |
| `POST` | `/api/patients`  | Create a new patient profile. | `{ "name": "...", "age": 30, "gender": "...", "contactInfo": "..." }` |
| `PUT`  | `/api/patients/:id` | Update patient details. **Requires `version` for concurrency.** | `{ "version": 1, "name": "New Name" ... }` |

#### 👨‍⚕️ Medical Visits (Doctor Only)

| Method | Endpoint         | Description                   | Request Body (JSON) |
| :----- | :--------------- | :---------------------------- | :------------------ |
| `GET`  | `/api/patients`  | Retrieve all patients.        | - |
| `GET`  | `/api/patients/:id` | Get detailed patient record. | - |
| `POST` | `/api/visits`    | Log a new medical visit.      | `{ "patientId": 1, "doctorName": "Dr. X", "diagnosis": "...", "prescription": "..." }` |

---

## 🧪 Testing

### Concurrency Test
We have a dedicated integration test to verify the **Optimistic Locking** mechanism. This script mimics two admins trying to update the same record at the exact same moment.

```bash
node tests/integrationTest.js
```
*Expected Result: One request succeeds (200 OK), the other fails (409 Conflict).*

---


