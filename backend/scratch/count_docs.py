import asyncio
from db import opportunities_col, events_col

async def count():
    opps = await opportunities_col.count_documents({})
    events = await events_col.count_documents({})
    print(f"OPPS: {opps}")
    print(f"EVENTS: {events}")

if __name__ == "__main__":
    asyncio.run(count())
