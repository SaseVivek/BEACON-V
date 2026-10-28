from pymongo import MongoClient
client = MongoClient("mongodb://localhost:27017")
db = client["beacon_v_db"]
zones = list(db["zones"].find())
for z in zones:
    print(z)
