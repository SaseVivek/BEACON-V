from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from app.models import TrajectoryInput, RoutingDecision, User
from app.services.ml_service import predict_destination, check_zone_eligibility
from app.routers.auth import get_current_user
from app.config import settings
from datetime import datetime

router = APIRouter()
client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

@router.post("/gps-input", response_model=RoutingDecision)
async def input_gps_trace(
    data: TrajectoryInput, 
    current_user: User = Depends(get_current_user)
):
    if len(data.gps_path) < 20:
        raise HTTPException(status_code=400, detail="Minimum 20 GPS points required")
    
    # 1. Predict Destination
    # Take the last 20 points
    recent_path = data.gps_path[-20:] 
    lat, lon = predict_destination(recent_path)
    
    # 2. Check Zones
    zones = list(db["zones"].find())
    eligible, target_zone, distance = check_zone_eligibility(lat, lon, zones)
    
    # 3. Store Decision
    decision_record = {
        "vehicle_id": data.vehicle_id,
        "owner_id": current_user.username,
        "predicted_lat": lat,
        "predicted_lon": lon,
        "is_eligible": eligible,
        "target_zone_name": target_zone,
        "distance_to_zone_km": distance,
        "timestamp": datetime.utcnow()
    }
    db["routing_decisions"].insert_one(decision_record)
    
    return RoutingDecision(**decision_record)

@router.get("/my-logs")
async def get_my_logs(current_user: User = Depends(get_current_user)):
    logs = list(db["routing_decisions"].find({"owner_id": current_user.username}))
    for log in logs:
        log["_id"] = str(log["_id"])
    return logs
