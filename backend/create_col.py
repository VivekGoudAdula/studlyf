import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load explicitly from the parent directory .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

print(f"Connecting to MongoDB at {MONGO_URL.split('@')[-1]}")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

async def create_collections():
    existing = await db.list_collection_names()
    for col in ["quizzes", "certificates", "cart", "enrollments", "resumes", "skill_assessments"]:
        if col not in existing:
            print(f"Creating collection {col}...")
            await db.create_collection(col)
        else:
            print(f"Collection {col} already exists.")
            
    print("All collections explicitly created.")

if __name__ == "__main__":
    asyncio.run(create_collections())
