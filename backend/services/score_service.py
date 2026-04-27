from db import scores_col, submissions_col
from bson import ObjectId
from datetime import datetime, timezone

async def submit_score(submission_id: str, judge_id: str, scores: dict, comments: str):
    score_doc = {
        "submission_id": submission_id,
        "judge_id": judge_id,
        "scores": scores, # e.g., {"innovation": 8, "execution": 7, "presentation": 9}
        "comments": comments,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Calculate average score
    total_score = sum(scores.values())
    avg_score = total_score / len(scores) if scores else 0
    score_doc["total_avg"] = avg_score
    
    result = await scores_col.insert_one(score_doc)
    
    # Update submission with the score
    await submissions_col.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"score": avg_score, "status": "Reviewed"}}
    )
    
    score_doc["_id"] = str(result.inserted_id)
    return score_doc

async def get_scores_for_submission(submission_id: str):
    cursor = scores_col.find({"submission_id": submission_id})
    scores = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        scores.append(doc)
    return scores
