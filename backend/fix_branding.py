
import motor.motor_asyncio
import asyncio
import os
from dotenv import load_dotenv

async def fix_branding():
    load_dotenv()
    client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("MONGO_URL"))
    db = client[os.getenv("DB_NAME", "studlyf_db")]
    
    res = await db.institutions.update_many(
        {"name": "Certified Institution Network"},
        {"$set": {"name": "Certified"}}
    )
    print(f"Branding updated for {res.modified_count} institution(s).")

if __name__ == "__main__":
    asyncio.run(fix_branding())
