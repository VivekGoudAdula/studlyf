"""
Migration Script: migrate_modules.py
- Moves modules embedded inside course documents into the `modules` collection.
- Ensures all course documents have the new schema fields: school, skills, duration.
- SAFE to run multiple times (idempotent).
"""

import asyncio
import os
import uuid
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
db = client[DB_NAME]

courses_col = db["courses"]
modules_col = db["modules"]


async def migrate():
    print("=== Module Migration Script ===\n")

    courses_found = 0
    modules_migrated = 0
    courses_schema_updated = 0

    async for course in courses_col.find({}):
        course_id = course.get("_id")
        courses_found += 1
        print(f"Processing course: {course_id} — '{course.get('title', 'N/A')}'")

        # ── 1. Migrate embedded modules ─────────────────────────────────────────
        embedded_modules = course.get("modules", [])
        if embedded_modules and isinstance(embedded_modules, list):
            # Check if modules are already in the modules collection
            existing_count = await modules_col.count_documents({"course_id": course_id})
            if existing_count == 0:
                print(f"  → Migrating {len(embedded_modules)} module(s) to modules collection...")
                for idx, mod in enumerate(embedded_modules):
                    mod_id = mod.get("_id") or mod.get("id")
                    if not mod_id or str(mod_id).isdigit():
                        mod_id = str(uuid.uuid4())

                    module_doc = {
                        "_id": str(mod_id),
                        "course_id": course_id,
                        "title": mod.get("title", "Untitled Module"),
                        "order_index": mod.get("order_index", idx + 1),
                        "lessons": mod.get("lessons", []),
                        "estimated_time": mod.get("estimated_time", "1 hour"),
                    }
                    # Upsert to be safe
                    await modules_col.update_one(
                        {"_id": module_doc["_id"]},
                        {"$setOnInsert": module_doc},
                        upsert=True
                    )
                    modules_migrated += 1
                print(f"  ✓ Migrated {len(embedded_modules)} module(s).")
            else:
                print(f"  ✓ Already has {existing_count} module(s) in collection, skipping migration.")
        else:
            print(f"  → No embedded modules found.")

        # ── 2. Ensure new schema fields exist ────────────────────────────────────
        update_fields = {}
        if "school" not in course:
            update_fields["school"] = ""
        if "skills" not in course:
            update_fields["skills"] = []
        if "duration" not in course:
            update_fields["duration"] = ""
        if "modules_count" not in course or course.get("modules_count") == 0:
            count = await modules_col.count_documents({"course_id": course_id})
            update_fields["modules_count"] = count

        if update_fields:
            await courses_col.update_one({"_id": course_id}, {"$set": update_fields})
            print(f"  ✓ Schema updated: {list(update_fields.keys())}")
            courses_schema_updated += 1
        else:
            print(f"  ✓ Schema already up-to-date.")

        print()

    print("=" * 40)
    print(f"Done!")
    print(f"  Courses processed    : {courses_found}")
    print(f"  Modules migrated     : {modules_migrated}")
    print(f"  Course docs updated  : {courses_schema_updated}")
    print("=" * 40)


if __name__ == "__main__":
    asyncio.run(migrate())
