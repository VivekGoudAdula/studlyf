from db import events_col, participants_col, teams_col, submissions_col, leaderboard_col
from bson import ObjectId
from datetime import datetime, timedelta

class InstitutionalAnalyticsService:
    """
    Professional Analytics Engine for event tracking and performance reporting.
    Exclusively uses dynamic database aggregations.
    """
    async def get_kpi_summary(self, institution_id: str):
        total_events = await events_col.count_documents({"institution_id": institution_id})
        total_participants = await participants_col.count_documents({"institution_id": institution_id})
        total_teams = await teams_col.count_documents({"institution_id": institution_id})
        
        # Calculate Average Score across all events
        score_res = await leaderboard_col.aggregate([
            {"$group": {"_id": None, "avg": {"$avg": "$total_score"}}}
        ]).to_list(1)
        avg_score = score_res[0]["avg"] if score_res else 0

        return {
            "total_events": total_events,
            "total_participants": total_participants,
            "total_teams": total_teams,
            "average_score": round(avg_score, 2),
            "timestamp": datetime.utcnow().isoformat()
        }

    async def get_registration_timeline(self, institution_id: str):
        # 30-day dynamic window
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        pipeline = [
            {"$match": {"registered_at": {"$gte": thirty_days_ago}}},
            {"$group": {
                "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$registered_at"}},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": 1}}
        ]
        results = await participants_col.aggregate(pipeline).to_list(None)
        return [{"date": r["_id"], "count": r["count"]} for r in results]

    async def get_departmental_breakdown(self, institution_id: str):
        pipeline = [
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        results = await participants_col.aggregate(pipeline).to_list(None)
        return [{"label": r["_id"] or "General", "value": r["count"]} for r in results]

analytics_service = InstitutionalAnalyticsService()
