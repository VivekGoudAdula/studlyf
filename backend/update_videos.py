import asyncio, os, certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
client = AsyncIOMotorClient(os.getenv("MONGO_URL"), tlsCAFile=certifi.where())
db = client[os.getenv("DB_NAME", "studlyf_db")]

VIDEOS = [
    ("ai-01-m01", "https://www.youtube.com/watch?v=2ePf9rue1Ao"),
    ("ai-01-m02", "https://www.youtube.com/watch?v=zjkBMFhNj_g"),
    ("ai-01-m03", "https://www.youtube.com/watch?v=ezQmI_tM3JI"),
    ("ai-01-m04", "https://www.youtube.com/watch?v=cW9shEB8h5E"),
    ("ai-01-m05", "https://www.youtube.com/watch?v=1CIpzeNxIhU"),
    ("ai-01-m06", "https://www.youtube.com/watch?v=dOxUroR57xs"),
    ("ai-01-m07", "https://www.youtube.com/watch?v=bZQun8Y4L2A"),
    ("ai-01-m08", "https://www.youtube.com/watch?v=T-D1OfcDW1M"),
    ("ai-01-m09", "https://www.youtube.com/watch?v=O8GUH0_htRM"),
    ("ai-01-m10", "https://www.youtube.com/watch?v=5NgNicANyqM"),
    ("ai-01-m11", "https://www.youtube.com/watch?v=Ho5b5C1C4WA"),
    ("ai-01-m12", "https://www.youtube.com/watch?v=JMUxmLyrhSk"),
]

async def update():
    for mod_id, url in VIDEOS:
        r = await db.videos.update_one(
            {"_id": f"{mod_id}-video"},
            {"$set": {"video_url": url}},
        )
        status = "Updated" if r.modified_count else "No change"
        print(f"{status} {mod_id}")
    print("Done!")

asyncio.run(update())
