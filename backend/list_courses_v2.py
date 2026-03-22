import asyncio
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv('.env')
MONGO_URL = os.getenv("MONGO_URL") or "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy"
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def list_courses():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client[DB_NAME]
    cursor = db.courses.find()
    print("Listing all courses in database:")
    async for course in cursor:
        print(f"ID: {course.get('_id')} | Title: {course.get('title')}")
    print("Done.")

if __name__ == "__main__":
    asyncio.run(list_courses())
