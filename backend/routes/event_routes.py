from fastapi import APIRouter, HTTPException, Body
from services.event_service import (
    create_event, 
    get_all_events, 
    get_event_by_id, 
    update_event, 
    delete_event,
    update_event_status
)
from typing import List, Optional

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.post("/")
async def post_event(data: dict = Body(...)):
    try:
        return await create_event(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def list_events(status: Optional[str] = None, institution_id: Optional[str] = None):
    filters = {}
    if status: filters["status"] = status
    if institution_id: filters["institution_id"] = institution_id
    return await get_all_events(filters)

@router.get("/{event_id}")
async def view_event(event_id: str):
    event = await get_event_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}")
async def modify_event(event_id: str, data: dict = Body(...)):
    return await update_event(event_id, data)

@router.delete("/{event_id}")
async def remove_event(event_id: str):
    return await delete_event(event_id)

@router.patch("/{event_id}/status")
async def change_event_status(event_id: str, status: str = Body(embed=True)):
    return await update_event_status(event_id, status)
