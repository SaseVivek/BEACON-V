from fastapi import APIRouter, Depends, HTTPException
from pymongo import MongoClient
from app.models import EmergencyMessage, User
from app.routers.auth import get_current_user
from app.config import settings

router = APIRouter()
client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]

def get_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user

@router.post("/", response_model=EmergencyMessage)
async def create_message(msg: EmergencyMessage, admin: User = Depends(get_admin_user)):
    msg_dict = msg.model_dump()
    result = db["messages"].insert_one(msg_dict)
    msg_dict["id"] = str(result.inserted_id)
    return EmergencyMessage(**msg_dict)

@router.get("/")
async def list_messages(current_user: User = Depends(get_current_user)):
    msgs = list(db["messages"].find())
    for m in msgs:
        m["id"] = str(m["_id"])
    return msgs
