import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[os.getenv("DB_NAME", "studlyf_db")]

async def verify():
    m = await db["modules"].count_documents({"course_id": "ai-01"})
    t = await db["theories"].count_documents({"module_id": {"$regex": "^ai-01-m"}})
    q = await db["quizzes"].count_documents({"module_id": {"$regex": "^ai-01-m"}})
    v = await db["videos"].count_documents({"module_id": {"$regex": "^ai-01-m"}})
    p = await db["projects"].count_documents({"_id": {"$regex": "^ai-01-proj"}})
    print(f"M={m} T={t} Q={q} V={v} P={p}")

asyncio.run(verify())
