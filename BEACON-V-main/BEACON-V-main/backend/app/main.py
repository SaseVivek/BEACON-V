from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.services.ml_service import load_model, predict_destination
from app.routers import auth, vehicles, messages, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML Model on startup
    print("Loading ML Model...")
    load_model()
    print("ML Model Loaded.")
    yield
    print("Shutting down...")

app = FastAPI(title="BEACON-V Backend", lifespan=lifespan)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(vehicles.router, prefix="/vehicles", tags=["Vehicles"])
app.include_router(messages.router, prefix="/messages", tags=["Messages"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "BEACON-V Backend is running"}
