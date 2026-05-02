from fastapi import APIRouter, HTTPException, Body, Query, Depends
from typing import List, Optional
from bson import ObjectId

from auth_institution import get_auth_user
from services.opportunity_service import (
    create_opportunity,
    get_all_opportunities,
    get_opportunity_by_id,
    apply_for_opportunity,
    get_user_applications,
    get_learner_opportunity_overview,
)
from db import notifications_col

router = APIRouter(prefix="/api/opportunities", tags=["Opportunities"])

@router.post("/")
async def post_opportunity(data: dict = Body(...)):
    """API to post a new opportunity."""
    try:
        return await create_opportunity(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_opportunities(
    type: Optional[str] = Query(None),
    institution_id: Optional[str] = Query(None)
):
    """API to list opportunities with optional filters."""
    try:
        filters = {}
        if type: filters["type"] = type
        if institution_id: filters["institution_id"] = institution_id
        return await get_all_opportunities(filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/applications")
async def my_applications(user: dict = Depends(get_auth_user)):
    """Authenticated learner: all portal applications with titles and status."""
    try:
        return await get_user_applications(user["user_id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/overview")
async def my_overview(user: dict = Depends(get_auth_user), limit: int = 8):
    """Authenticated learner: upcoming deadlines + application timeline widgets."""
    try:
        return await get_learner_opportunity_overview(user["user_id"], limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/notifications")
async def my_notifications(user: dict = Depends(get_auth_user), limit: int = 40):
    """In-app notifications for the current learner (e.g. application review updates)."""
    try:
        cap = max(1, min(int(limit), 100))
        cur = notifications_col.find({"user_id": user["user_id"]}).sort("created_at", -1).limit(cap)
        items = []
        async for doc in cur:
            doc["_id"] = str(doc["_id"])
            items.append(doc)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/me/notifications/{notification_id}/read")
async def mark_my_notification_read(notification_id: str, user: dict = Depends(get_auth_user)):
    try:
        await notifications_col.update_one(
            {"_id": ObjectId(notification_id), "user_id": user["user_id"]},
            {"$set": {"is_read": True}},
        )
        return {"status": "ok"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid notification id")


@router.get("/user/{user_id}/applications")
async def list_user_applications(user_id: str, user: dict = Depends(get_auth_user)):
    """List applications for a user (self or admin only)."""
    role = str(user.get("role") or "").lower()
    if user.get("user_id") != user_id and role not in ("admin", "super_admin"):
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        return await get_user_applications(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/apply")
async def apply(data: dict = Body(...)):
    """API to apply for an opportunity."""
    try:
        return await apply_for_opportunity(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{opportunity_id}")
async def view_opportunity(
    opportunity_id: str,
    applicant_user_id: Optional[str] = Query(
        None,
        description="If set, draft listings remain visible when this user has already applied.",
    ),
):
    """API to view a specific opportunity."""
    try:
        opportunity = await get_opportunity_by_id(opportunity_id, applicant_user_id)
        if not opportunity:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        return opportunity
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
