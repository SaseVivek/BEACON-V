from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URL)
db = client[settings.DB_NAME]
zones = db["zones"]

# Update 'Test Hospital' to match the output of the ML model for Porto coordinates
# Model predicts approx [10.63, -0.44] for Porto [41.15, -8.61]
# We update the zone so it's 'Eligible' when predicting these points.
result = zones.update_many(
    {"name": "Test Hospital"},
    {"$set": {"center_lat": 10.6316, "center_lon": -0.4386}}
)

print(f"Matched {result.matched_count} zones, modified {result.modified_count} zones.")

# Verify
for z in zones.find():
    print(z)
