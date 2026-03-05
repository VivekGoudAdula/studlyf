import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
from dotenv import load_dotenv

load_dotenv('.env')
MONGO_URL = os.getenv("MONGO_URL") or "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy"
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def test():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client[DB_NAME]
    cols = await db.list_collection_names()
    print(f"Collections in {DB_NAME}: {cols}")
    resumes_count = await db["resumes"].count_documents({})
    print(f"Count in 'resumes': {resumes_count}")
    resume_count = await db["resume"].count_documents({})
    print(f"Count in 'resume': {resume_count}")

if __name__ == "__main__":
    asyncio.run(test())
