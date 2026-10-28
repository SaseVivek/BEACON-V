from pymongo import MongoClient
from app.utils import get_password_hash
from app.config import settings

def seed_admin():
    client = MongoClient(settings.MONGO_URL)
    db = client[settings.DB_NAME]
    users = db["users"]
    
    admin_email = "admin@gmail.com"
    admin_pass = "admin@gmail.com"
    
    # Check if exists
    existing = users.find_one({"username": admin_email})
    
    user_data = {
        "username": admin_email,
        "password_hash": get_password_hash(admin_pass),
        "role": "admin"
    }
    
    if existing:
        print(f"Updating existing admin user: {admin_email}")
        users.update_one({"username": admin_email}, {"$set": user_data})
    else:
        print(f"Creating new admin user: {admin_email}")
        users.insert_one(user_data)
        
    print("Admin credentials set successfully.")

if __name__ == "__main__":
    seed_admin()
