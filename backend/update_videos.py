import asyncio, os, certifi, re
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = AsyncIOMotorClient(os.getenv("MONGO_URL"), tlsCAFile=certifi.where())
db = client[os.getenv("DB_NAME", "studlyf_db")]

async def fix_urls():
    async for v in db.videos.find({"module_id": {"$regex": "^ai-01"}}):
        url = v.get("video_url", "")
        # Convert watch URL to embed URL
        match = re.search(r'(?:youtube\.com/watch\?v=|youtu\.be/)([a-zA-Z0-9_-]+)', url)
        if match:
            embed_url = f"https://www.youtube-nocookie.com/embed/{match.group(1)}"
            await db.videos.update_one(
                {"_id": v["_id"]},
                {"$set": {"video_url": embed_url}}
            )
            print(f"{v['_id']}: {url} -> {embed_url}")
        elif "embed" in url:
            print(f"{v['_id']}: Already embed format")
        else:
            print(f"{v['_id']}: Unknown format: {url}")
    print("\nDone! All videos now use embed URLs.")

asyncio.run(fix_urls())
