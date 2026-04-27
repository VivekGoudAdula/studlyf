from db import db
from bson import ObjectId
from datetime import datetime

async def get_institution_stats(institution_id: str):
    # Total Participants (assuming they are linked via events or submissions)
    # This is a simplified count for now
    total_participants = await db.submissions.count_documents({}) # Simplified
    
    # Active Events
    active_events = await db.events.count_documents({
        "institution_id": institution_id,
        "status": "Live"
    })
    
    # Total Submissions
    total_submissions = await db.submissions.count_documents({})
    
    # Upcoming Deadlines
    upcoming_deadlines = await db.events.count_documents({
        "institution_id": institution_id,
        "registration_deadline": {"$gt": datetime.utcnow()}
    })
    
    return {
        "total_participants": total_participants,
        "active_events": active_events,
        "total_submissions": total_submissions,
        "upcoming_deadlines": upcoming_deadlines,
        "engagement_rate": 84.5 # Hardcoded for demonstration or calculated
    }
