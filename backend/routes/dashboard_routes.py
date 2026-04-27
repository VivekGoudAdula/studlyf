from fastapi import APIRouter, HTTPException, Query
from services.dashboard_service import get_institution_stats

router = APIRouter(prefix="/api/institution/dashboard", tags=["Institution Dashboard"])

@router.get("/stats")
async def fetch_dashboard_stats(institution_id: str = Query(...)):
    try:
        return await get_institution_stats(institution_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
