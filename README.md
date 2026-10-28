

# 🚗 BEACON-V: Delay-Tolerant Vehicular Network

**An AI-powered vehicular network monitoring and trajectory prediction system designed for delay-tolerant communication environments.**

BEACON-V is a web-based vehicular monitoring platform that visualizes vehicle locations, accepts GPS and sensor data, and predicts future vehicle coordinates. It combines an interactive map interface with a FastAPI backend, MongoDB data storage, and TensorFlow/Keras-based prediction capabilities.

The system features a modern Command Center interface with dark mode, glassmorphism styling, and JWT-based authentication for secure access.

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Running the Application](#-running-the-application)
- [Using the Application](#-using-the-application)
- [Authentication](#-authentication)
- [Trajectory Prediction Workflow](#-trajectory-prediction-workflow)
- [API Documentation](#-api-documentation)
- [Security Considerations](#-security-considerations)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

Vehicular networks enable communication between vehicles and other network entities. However, intermittent connectivity, network congestion, and communication delays can make continuous vehicle monitoring challenging.

BEACON-V provides a monitoring interface for simulating and analyzing vehicle movement in such environments.

The platform enables users to:

- Submit vehicle GPS coordinates and sensor readings.
- Visualize vehicle positions on an interactive map.
- Estimate the next likely vehicle coordinates.
- Access the monitoring dashboard through an authentication portal.
- Monitor application and backend connectivity status.

**Project objective:** Develop a modular vehicular monitoring system that combines geospatial visualization, trajectory prediction, and secure web access.

## 🚀 Key Features

### 1. Real-Time Vehicle Tracking
- Interactive map powered by Leaflet.
- Visualization of vehicle locations using geographic coordinates.
- Support for simulated vehicle beacon inputs.
- A foundation for displaying vehicle movement and tracking history.

### 2. Trajectory Prediction
- Backend support for vehicle movement prediction.
- GPS and sensor inputs such as latitude, longitude, speed, and heading.
- Prediction of the next likely coordinate based on the implemented prediction logic.
- TensorFlow/Keras integration for machine-learning-based prediction capabilities.

*Note: Prediction accuracy depends on the implemented model, available training data, and validation results.*

### 3. Secure Authentication
- Login and registration interface.
- JWT-based authentication architecture.
- Authenticated access to the Command Center.
- Support for registering new users or vehicle IDs.

### 4. Command Center Dashboard
- Modern dark-themed interface.
- Glassmorphism-inspired components.
- Interactive map and trajectory input panel.
- System connectivity status indicator.
- Lucide icons for a consistent interface.

### 5. Delay-Tolerant Network Monitoring
- A foundation for handling vehicle data in environments with intermittent connectivity.
- Potential support for storing and forwarding vehicle beacons during network disruptions.
- Extensible architecture for historical trajectory analysis.

*Store-and-forward buffering and offline synchronization should be considered implemented only if the corresponding backend logic is present.*

## 🛠️ Technology Stack

| Component | Technologies | Purpose |
|---|---|---|
| Frontend | React, Vite | Interactive web application |
| Styling | Tailwind CSS v4 | Responsive interface and visual design |
| Mapping | Leaflet | Geographic visualization |
| Icons | Lucide Icons | Dashboard icons |
| Backend | FastAPI | REST API and application logic |
| Database | MongoDB | Document-based data storage |
| Machine Learning | TensorFlow, Keras | Trajectory prediction capabilities |
| Authentication | JWT | Token-based authentication |
| Runtime | Node.js, Python | Frontend tooling and backend execution |

## 🏗️ System Architecture

```text
                  ┌──────────────────────────┐
                  │       User / Operator    │
                  └────────────┬─────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │   React + Vite Frontend  │
                  │                          │
                  │ Login / Registration     │
                  │ Command Center Dashboard │
                  │ Leaflet Map Visualization│
                  └────────────┬─────────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                  ┌──────────────────────────┐
                  │      FastAPI Backend     │
                  │                          │
                  │ Authentication           │
                  │ Vehicle Data Processing  │
                  │ Trajectory Prediction    │
                  └───────┬─────────┬────────┘
                          │         │
                          ▼         ▼
                ┌─────────────┐  ┌────────────────┐
                │   MongoDB   │  │ TensorFlow /   │
                │             │  │ Keras Model    │
                │ Vehicle Data│  │ Prediction     │
                └─────────────┘  └────────────────┘
```

### Data Flow

1. The user authenticates through the web interface.
2. The operator submits vehicle coordinates and sensor readings.
3. The frontend communicates with the FastAPI backend.
4. The backend validates and processes the submitted data.
5. Vehicle information can be stored in MongoDB.
6. The prediction component estimates a future coordinate using the configured prediction logic.
7. The frontend displays vehicle positions and prediction results on the map.

## 📂 Project Structure

The following is a suggested structure consistent with the supplied technology stack. Adapt it to match the actual repository.

```text
BEACON-V/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   └── database.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 💻 Prerequisites

Install the following software before starting:

- **Node.js and npm** — for frontend dependencies and the Vite development server.
- **Python 3.8+** — for backend execution, subject to compatibility with the installed TensorFlow version.
- **MongoDB** — local installation or a configured remote database.
- **Git** — optional, for cloning and version control.

Verify your installations:

```bash
node --version
npm --version
python --version
git --version
```

## ⚙️ Installation and Setup

### Step 1: Navigate to the Project Directory

Open a terminal in the directory containing the project.

```bash
cd BEACON-V
```

If you have not cloned the repository yet, use:

```bash
git clone <YOUR_REPOSITORY_URL>
cd BEACON-V
```

Replace the placeholder with your actual repository URL.

### Step 2: Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Ensure the `requirements.txt` file includes the dependencies actually used by your backend, such as FastAPI, Uvicorn, the MongoDB driver, JWT/authentication libraries, and TensorFlow/Keras if required.

### Step 3: Configure Environment Variables

Create a `.env` file in the backend directory if the application uses environment-based configuration.

Example:

```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=beacon_v
JWT_SECRET_KEY=replace_with_a_secure_random_secret
JWT_ALGORITHM=HS256
```

Use variable names that match the application's actual configuration. Do not commit real secrets or production credentials to GitHub.

### Step 4: Start MongoDB

Make sure the MongoDB service is running and accessible using the configured connection URI.

For a local installation, the application may use:

```text
mongodb://localhost:27017
```

If your application does not persist vehicle data in MongoDB yet, configure the database integration before relying on persistent storage.

### Step 5: Install Frontend Dependencies

Open a second terminal and navigate to the frontend directory:

```bash
cd BEACON-V/frontend
npm install
```

If the frontend needs a backend URL, configure the appropriate Vite environment variable, such as:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Use the exact variable name expected by your frontend code.

## ▶️ Running the Application

Run the backend and frontend in separate terminals.

### Terminal 1: Backend

From the project root:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

The backend will typically be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is typically available at:

```text
http://127.0.0.1:8000/docs
```

### Terminal 2: Frontend

From the project root:

```bash
cd frontend
npm run dev
```

Vite commonly starts on port `5173`, but the actual port depends on your configuration. If your project explicitly configures port `3000`, use:

```text
http://localhost:3000
```

Otherwise, open the local URL printed in the terminal.

## 🖥️ Using the Application

### 1. Authentication Portal

Open the frontend URL in your browser.

- Use the login page to access the application.
- Select **Register Vehicle ID** to register a new account.
- Ensure the backend and database are available when authentication requires them.

**Development credentials supplied with the project:**

| Field | Value |
|---|---|
| Email | `admin@gmail.com` |
| Password | `admin@gmail.com` |

These credentials are for development only, assuming they are configured in your local application. Change or remove default credentials before deployment.

### 2. Command Center Dashboard

After successful authentication, open the Command Center.

The dashboard provides the primary interface for entering vehicle data and viewing its location.

### 3. Enter Vehicle Trajectory Data

Provide the GPS and sensor values supported by your application. Typical fields include:

| Input | Description |
|---|---|
| Latitude | Geographic north–south position |
| Longitude | Geographic east–west position |
| Speed | Vehicle speed, using the application's configured unit |
| Heading | Direction of vehicle travel |
| Timestamp | Time associated with the beacon, if supported |
| Vehicle ID | Identifier for the vehicle, if supported |

Use valid latitude and longitude values:

- Latitude: `-90` to `90`
- Longitude: `-180` to `180`

### 4. View Vehicle Locations

The Leaflet map visualizes the submitted vehicle position. Depending on the implemented features, the interface may also display predicted coordinates and movement paths.

### 5. Monitor System Status

Use the status indicator to check whether the application reports a successful backend connection. A displayed ONLINE status should be backed by an actual health check rather than only a static UI label.

## 🤖 Trajectory Prediction Workflow

The trajectory prediction component is intended to estimate a vehicle's next likely geographic position.

A typical prediction pipeline includes:

1. **Input collection:** Receive GPS coordinates and relevant sensor measurements.
2. **Validation:** Check coordinate ranges, data types, and missing values.
3. **Preprocessing:** Normalize and prepare inputs according to the model's training pipeline.
4. **Inference:** Pass the prepared inputs to the configured prediction model or prediction logic.
5. **Coordinate output:** Return the predicted location in the expected format.
6. **Visualization:** Display the result on the Leaflet map.

A trained TensorFlow/Keras model should be loaded and used for inference if machine-learning prediction is enabled. A rule-based or kinematic baseline can be useful during development, but it should not be described as a trained AI model.

Prediction performance should be evaluated using suitable trajectory error metrics, such as mean displacement error, and validated against recorded or simulated vehicle trajectories.

## 🔌 API Documentation

BEACON-V uses FastAPI for backend services.

When the application is running, visit:

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

These pages display the API routes registered in the running application.

Potential API groups include:

| API Group | Purpose |
|---|---|
| Authentication | Login, registration, and token issuance |
| Vehicle Data | Submit and retrieve vehicle beacons |
| Trajectory Prediction | Request a predicted future position |
| Health Check | Check backend availability |

The actual endpoint paths, HTTP methods, request schemas, and responses depend on the implemented FastAPI routes. Refer to the generated API documentation rather than assuming these example API groups already exist.

## 🔐 Security Considerations

- Store JWT signing secrets and database credentials in environment variables.
- Use strong passwords and appropriate password hashing.
- Validate JWT signatures, expiration times, and authorization requirements.
- Protect vehicle-data and prediction endpoints with suitable access controls.
- Configure CORS for trusted frontend origins.
- Use HTTPS and secure deployment settings in production.
- Replace development credentials before deployment.
- Avoid logging access tokens, passwords, or sensitive vehicle information.

## 🔮 Future Enhancements

Potential improvements to BEACON-V include:

- **LSTM-based trajectory prediction:** Train sequence models on historical vehicle movement data.
- **Delay-tolerant data delivery:** Add local buffering, store-and-forward mechanisms, and synchronization after connectivity returns.
- **Historical trajectory playback:** Visualize previously recorded vehicle movement.
- **Multi-vehicle monitoring:** Display and filter multiple vehicles simultaneously.
- **Geospatial analytics:** Detect route deviations, estimate arrival times, and identify unusual movement.
- **Prediction evaluation:** Compare predicted and observed coordinates using standard error metrics.
- **Network simulation:** Simulate communication delays, packet loss, and intermittent connectivity.
- **Role-based access control:** Separate administrator and operator permissions.
- **Deployment:** Containerize services with Docker and deploy the application to a suitable cloud environment.
- **Automated testing:** Add unit, integration, API, and prediction-pipeline tests.

These are proposed enhancements, not claims that all features are currently implemented.

## 🤝 Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes and add relevant tests.
4. Commit your changes with a descriptive message.
5. Open a pull request explaining the change.

Example:

```bash
git checkout -b feature/trajectory-improvements
git add .
git commit -m "Improve trajectory prediction workflow"
git push origin feature/trajectory-improvements
```

## 📄 License

No license has been specified in the supplied project description. Add a `LICENSE` file before distributing the project publicly. Choose a license that matches your intended usage and ownership requirements.

---

**BEACON-V — Intelligent Vehicle Monitoring for Delay-Tolerant Networks**

*Combining geospatial visualization, predictive analytics, and secure web technologies to support vehicular network monitoring.*
