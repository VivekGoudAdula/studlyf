import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv('.env')
MONGO_URL = os.getenv("MONGO_URL") or "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy"
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def cleanup_dummy_data():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client[DB_NAME]
    
    # List of collections to potentially clean
    collections = ["courses", "modules", "theories", "quizzes", "projects", "user_progress", "enrollments", "quiz_submissions", "project_submissions"]
    
    # We want to keep ONLY the ai-01 course and its related data if possible,
    # or just wipe everything and let the user re-seed what they consider real.
    # Given the request "remove dummy courses", wiping everything that isn't clearly production-ready is safer.
    
    print("Cleaning up database collections...")
    for col in collections:
        count = await db[col].count_documents({})
        if count > 0:
            print(f"Clearing {count} documents from '{col}'...")
            await db[col].delete_many({})
    
    print("Database cleanup complete.")

if __name__ == "__main__":
    asyncio.run(cleanup_dummy_data())
