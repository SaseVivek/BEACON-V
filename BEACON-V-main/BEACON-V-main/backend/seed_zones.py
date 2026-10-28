from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]
zones_collection = db["zones"]

# Porto साठी सॅम्पल झोन
porto_zone = {
    "name": "Porto Central Hospital",
    "center_lat": 41.15,
    "center_lon": -8.61,
    "radius_km": 5.0
}

# जुने झोन काढून नवीन ॲड करा
zones_collection.delete_many({})
zones_collection.insert_one(porto_zone)

print("Sample Zone added successfully for Porto!")
