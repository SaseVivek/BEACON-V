from pydantic import BaseModel, Field
from typing import List, Optional, Tuple
from datetime import datetime

# USER MODELS
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: str = "driver" # driver, admin

class User(UserBase):
    id: Optional[str] = None
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# ZONE MODELS
class DestinationZone(BaseModel):
    name: str
    center_lat: float
    center_lon: float
    radius_km: float

# VEHICLE & TRACKING MODELS
class GPSPoint(BaseModel):
    latitude: float
    longitude: float

class TrajectoryInput(BaseModel):
    vehicle_id: str
    gps_path: List[GPSPoint] # Array of 20 points
    
class RoutingDecision(BaseModel):
    vehicle_id: str
    predicted_lat: float
    predicted_lon: float
    is_eligible: bool
    target_zone_name: Optional[str] = None
    distance_to_zone_km: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# EMERGENCY MESSAGE MODELS
class EmergencyMessage(BaseModel):
    id: Optional[str] = None
    content: str
    priority: str # High, Medium, Low
    target_zone_name: str
    assigned_vehicle_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
