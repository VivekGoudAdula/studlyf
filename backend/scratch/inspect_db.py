import asyncio
from db import events_col, opportunities_col
from bson import json_util
import json

async def check():
    print("--- EVENTS ---")
    cursor = events_col.find({}).limit(2)
    async for doc in cursor:
        print(json.dumps(doc, default=json_util.default, indent=2))
    
    print("--- OPPORTUNITIES ---")
    cursor = opportunities_col.find({}).limit(2)
    async for doc in cursor:
        print(json.dumps(doc, default=json_util.default, indent=2))

if __name__ == "__main__":
    asyncio.run(check())
