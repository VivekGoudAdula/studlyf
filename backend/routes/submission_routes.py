from fastapi import APIRouter, HTTPException, Body
from services.submission_service import create_submission, get_all_submissions, get_submission_by_id, update_submission_status
from typing import List, Optional

router = APIRouter(prefix="/api/submissions", tags=["Submissions"])

@router.post("/")
async def submit_project(data: dict = Body(...)):
    try:
        return await create_submission(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_submissions(event_id: Optional[str] = None, status: Optional[str] = None):
    filters = {}
    if event_id: filters["event_id"] = event_id
    if status: filters["status"] = status
    return await get_all_submissions(filters)

@router.get("/{submission_id}")
async def view_submission(submission_id: str):
    submission = await get_submission_by_id(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.patch("/{submission_id}/status")
async def change_status(submission_id: str, status: str = Body(embed=True)):
    return await update_submission_status(submission_id, status)
