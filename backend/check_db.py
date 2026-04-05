import asyncio
import json
from db import courses_col, modules_col

async def check():
    courses = []
    async for c in courses_col.find():
        courses.append(c)
        
    modules = []
    async for m in modules_col.find():
        modules.append(m)
        
    with open("db_content.json", "w") as f:
        json.dump({"courses": courses, "modules": modules}, f, default=str, indent=2)
    print("Saved to db_content.json")

if __name__ == "__main__":
    asyncio.run(check())
