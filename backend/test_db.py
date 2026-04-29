
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from dotenv import load_dotenv

async def test_conn():
    load_dotenv()
    url = os.getenv("MONGO_URL")
    print("Testing connection...")
    try:
        client = AsyncIOMotorClient(
            url,
            serverSelectionTimeoutMS=5000,
            tlsCAFile=certifi.where() if url.lower().startswith("mongodb+srv://") else None
        )
        await client.admin.command('ping')
        print("SUCCESS: MongoDB Connection Successful!")
    except Exception as e:
        print(f"FAILURE: Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
