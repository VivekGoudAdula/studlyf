import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load explicitly from the parent directory .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def check_ads():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    ads_col = db["advertisements"]
    
    print(f"Checking collection: {ads_col.name}")
    async for ad in ads_col.find({}):
        active_val = ad.get("active")
        print(f"Ad: {ad.get('title')} | active: {active_val} (type: {type(active_val)})")

if __name__ == "__main__":
    asyncio.run(check_ads())
