import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from dotenv import load_dotenv

# Load .env
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def create_indexes():
    client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
    db = client[DB_NAME]
    
    print(f"Connecting to database: {DB_NAME}")
    
    # 1. Modules Collection
    print("Indexing modules...")
    await db["modules"].create_index([("course_id", 1)])
    await db["modules"].create_index([("order_index", 1)])
    
    # 2. Theories/Videos/Quizzes/Projects (Content)
    print("Indexing content items...")
    await db["theories"].create_index([("module_id", 1)])
    await db["videos"].create_index([("module_id", 1)])
    await db["quizzes"].create_index([("module_id", 1), ("course_id", 1)])
    await db["projects"].create_index([("module_id", 1)])
    
    # 3. Progress Tracking (Critical for performance)
    print("Indexing progress tracking...")
    await db["progress"].create_index([("user_id", 1), ("module_id", 1)])
    await db["progress"].create_index([("user_id", 1), ("course_id", 1)])
    
    # 4. Enrollments & Certificates
    print("Indexing enrollments and certificates...")
    await db["enrollments"].create_index([("user_id", 1), ("course_id", 1)])
    await db["certificates"].create_index([("user_id", 1), ("course_id", 1)])
    await db["certificates"].create_index([("certificate_id", 1)], unique=True)
    
    # 5. Users
    print("Indexing users...")
    await db["users"].create_index([("user_id", 1)], unique=True)
    
    print("--- SUCCESS: All performance indexes created! ---")
    client.close()

if __name__ == "__main__":
    asyncio.run(create_indexes())
