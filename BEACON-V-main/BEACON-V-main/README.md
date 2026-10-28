# BEACON-V: Delay-Tolerant Vehicular Network

BEACON-V is a robust vehicular network monitoring system designed to handle delay-tolerant communication scenarios. It features a modern, glassmorphism-inspired UI and a powerful backend for trajectory prediction and tracking.

## 🚀 Features
- **Real-time Tracking**: Leaflet-based map visualization of vehicle locations.
- **Trajectory Prediction**: AI-powered prediction of vehicle movement.
- **Secure Access**: JWT-based authentication with a secure login/registration portal.
- **Modern UI**: specialized "Command Center" aesthetic with dark mode and glassmorphism.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TailwindCSS (v4), Leaflet, Lucide Icons.
- **Backend**: FastAPI, MongoDB, TensorFlow/Keras (for predictions).

## 🏁 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.8+
- MongoDB

### Installation

1. **Clone/Setup Repository**
   Ensure you are in the `Development` directory.

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## 🏃 Running the Application

You need to run both the backend and frontend terminals.

**Terminal 1: Backend**
```bash
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

Access the application at: `http://localhost:3000`

## 📖 User Guide

### 1. Authentication
- **Login Page**: You will be greeted by the Access Portal.
- **Credentials**:
  - **Email**: `admin@gmail.com`
  - **Password**: `admin@gmail.com`
- **New Users**: Click "Register Vehicle ID" to create a new account.

### 2. Command Center (Dashboard)
Once logged in, you enter the Command Center.
- **Trajectory Input**: On the left, input raw GPS and sensor data (Latitude, Longitude, Speed, Heading, etc.) to simulate vehicle beacons.
- **Live Tracking Feed**: The map on the right visualizes the vehicle's position.
- **Prediction**: The system predicts the next likely coordinate based on standard constraints.

### 3. System Status
- The status bar at the bottom indicates if the system is ONLINE and connected to the backend.

---
