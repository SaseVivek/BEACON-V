from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from app.models import DestinationZone, User
from app.routers.auth import get_current_user
from app.config import settings

router = APIRouter()
client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user

@router.post("/zones", response_model=DestinationZone)
async def create_zone(zone: DestinationZone, admin: User = Depends(get_admin_user)):
    db["zones"].insert_one(zone.model_dump())
    return zone

@router.get("/zones")
async def list_zones(current_user: User = Depends(get_current_user)):
    zones = list(db["zones"].find({}, {"_id": 0}))
    return zones

@router.get("/stats")
async def get_stats(admin: User = Depends(get_admin_user)):
    total_vehicles = len(db["routing_decisions"].distinct("vehicle_id"))
    eligible_count = db["routing_decisions"].count_documents({"is_eligible": True})
    total_predictions = db["routing_decisions"].count_documents({})
    
    return {
        "total_vehicles_tracked": total_vehicles,
        "eligible_predictions": eligible_count,
        "total_predictions": total_predictions
    }
