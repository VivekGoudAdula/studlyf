import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = AsyncIOMotorClient(os.getenv("MONGO_URL"), tlsCAFile=certifi.where())
db = client["studlyf_db"]

async def check():
    async for v in db.videos.find({"module_id": {"$regex": "^ai-01"}}):
        print(f"{v['_id']}: {v.get('video_url', 'MISSING')}")

asyncio.run(check())
