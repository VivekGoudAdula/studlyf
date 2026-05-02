from fastapi import APIRouter, HTTPException, Body, Query
from typing import List, Optional
from services.opportunity_service import (
    create_opportunity,
    get_all_opportunities,
    get_opportunity_by_id,
    apply_for_opportunity,
    get_user_applications
)

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

@router.get("/{opportunity_id}")
async def view_opportunity(opportunity_id: str):
    """API to view a specific opportunity."""
    try:
        opportunity = await get_opportunity_by_id(opportunity_id)
        if not opportunity:
            raise HTTPException(status_code=404, detail="Opportunity not found")
        return opportunity
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/apply")
async def apply(data: dict = Body(...)):
    """API to apply for an opportunity."""
    try:
        return await apply_for_opportunity(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}/applications")
async def list_user_applications(user_id: str):
    """API to list applications for a specific user."""
    try:
        return await get_user_applications(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
