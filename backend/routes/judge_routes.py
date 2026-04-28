from fastapi import APIRouter, HTTPException, Body
from services.judge_service import create_judge, get_all_judges, assign_judge_to_submission
from services.score_service import submit_score, get_scores_for_submission

router = APIRouter(prefix="/api/judges", tags=["Judges"])

@router.post("/")
async def add_judge(data: dict = Body(...)):
    return await create_judge(data)

@router.get("/")
async def list_judges():
    return await get_all_judges()

@router.post("/assign")
async def assign_judge(submission_id: str = Body(...), judge_id: str = Body(...)):
    return await assign_judge_to_submission(submission_id, judge_id)

@router.post("/score")
async def score_submission(
    submission_id: str = Body(...), 
    judge_id: str = Body(...), 
    scores: dict = Body(...), 
    comments: str = Body(...)
):
    # Integration Enhancement: Refresh leaderboard in background
    import asyncio
    from db import submissions_col
    from services.leaderboard_service import leaderboard_service
    async def _refresh():
        sub = await submissions_col.find_one({"_id": ObjectId(submission_id)})
        if sub: await leaderboard_service.calculate_event_leaderboard(sub.get("event_id"))
    asyncio.create_task(_refresh())

    return await submit_score(submission_id, judge_id, scores, comments)

@router.get("/scores/{submission_id}")
async def view_scores(submission_id: str):
    return await get_scores_for_submission(submission_id)
