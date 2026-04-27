from db import judges_col
from bson import ObjectId
from datetime import datetime, timezone

async def create_judge(data: dict):
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await judges_col.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data

async def get_all_judges():
    cursor = judges_col.find({}).sort("name", 1)
    judges = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        judges.append(doc)
    return judges

async def assign_judge_to_submission(submission_id: str, judge_id: str):
    from db import submissions_col
    await submissions_col.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"assigned_judge_id": judge_id, "status": "Under Review"}}
    )
    return True
