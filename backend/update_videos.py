import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = AsyncIOMotorClient(os.getenv("MONGO_URL"), tlsCAFile=certifi.where())
db = client[os.getenv("DB_NAME", "studlyf_db")]

VIDEOS = {
    "ai-01-m01": {"url": "https://www.youtube.com/watch?v=2ePf9rue1Ao", "title": "Introduction to AI"},
    "ai-01-m02": {"url": "https://www.youtube.com/watch?v=zjkBMFhNj_g", "title": "How Generative AI Works"},
    "ai-01-m03": {"url": "https://www.youtube.com/watch?v=dOxUroR57xs", "title": "Prompt Engineering"},
    "ai-01-m04": {"url": "https://www.youtube.com/watch?v=jGpF0K4E8tM", "title": "Using ChatGPT"},
    "ai-01-m05": {"url": "https://www.youtube.com/watch?v=1CIpzeNxIhU", "title": "AI Image Generation"},
    "ai-01-m06": {"url": "https://www.youtube.com/watch?v=JTxsNm9IdYU", "title": "AI Productivity"},
    "ai-01-m07": {"url": "https://www.youtube.com/watch?v=bZQun8Y4L2A", "title": "AI APIs"},
    "ai-01-m08": {"url": "https://www.youtube.com/watch?v=T-D1OfcDW1M", "title": "RAG Explained"},
    "ai-01-m09": {"url": "https://www.youtube.com/watch?v=O8GUH0_htRM", "title": "AI Agents"},
    "ai-01-m10": {"url": "https://www.youtube.com/watch?v=5NgNicANyqM", "title": "Building AI Apps"},
    "ai-01-m11": {"url": "https://www.youtube.com/watch?v=Ho5b5C1C4WA", "title": "AI Ethics"},
    "ai-01-m12": {"url": "https://www.youtube.com/watch?v=JMUxmLyrhSk", "title": "Future of AI"},
}

async def update_videos():
    for mod_id, info in VIDEOS.items():
        result = await db["videos"].update_one(
            {"_id": f"{mod_id}-video"},
            {"$set": {"video_url": info["url"], "is_dummy": False, "duration": "15 min"}},
        )
        if result.modified_count:
            print(f"Updated {mod_id}: {info['title']}")
        else:
            await db["videos"].update_one(
                {"_id": f"{mod_id}-video"},
                {"$set": {"_id": f"{mod_id}-video", "module_id": mod_id, "video_url": info["url"], "is_dummy": False, "duration": "15 min"}},
                upsert=True
            )
            print(f"Upserted {mod_id}: {info['title']}")
    print("\nDone! All 12 videos updated.")

asyncio.run(update_videos())
