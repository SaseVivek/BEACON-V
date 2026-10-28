import os

class Settings:
    SECRET_KEY: str = "supersecretkey" # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MONGO_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "beacon_v_db"

settings = Settings()
