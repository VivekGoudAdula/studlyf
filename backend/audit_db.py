
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def audit_db():
    # Load env
    load_dotenv()
    mongo_url = os.getenv("MONGO_URL")
    db_name = os.getenv("DB_NAME", "studlyf_db")
    
    print(f"Connecting to MongoDB: {db_name}...")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    collections = await db.list_collection_names()
    print(f"\nFound {len(collections)} collections:")
    
    for col_name in collections:
        count = await db[col_name].count_documents({})
        print(f" - {col_name}: {count} documents")
        
        if col_name in ['events', 'participants', 'institutions', 'submissions']:
            # Peek at the latest doc to see structure
            latest = await db[col_name].find_one(sort=[('_id', -1)])
            if latest:
                print(f"   [PEEK] Latest {col_name} ID: {latest.get('_id')}")
                if col_name == 'events':
                    print(f"   [DATA] Title: {latest.get('title')} | Institution: {latest.get('institution_id')}")

    print("\nAudit Complete.")

if __name__ == "__main__":
    asyncio.run(audit_db())
