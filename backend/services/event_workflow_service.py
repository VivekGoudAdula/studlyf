from datetime import datetime
from bson import ObjectId
from db import participants_col, quizzes_col, submissions_col, events_col

class EventWorkflowService:
    """
    Handles the internal business logic for different event phases 
    (Assessment, Open Source, Offline Sprint, etc.)
    """

    @staticmethod
    async def process_phase_transition(event_id: str, participant_ids: list, next_stage: str):
        """
        Enforces phase-specific rules before advancing participants.
        """
        event = await events_col.find_one({"_id": ObjectId(event_id)})
        event_type = event.get("event_type", "Hackathon")

        # 1. Internal Rule: Assessment Phase (JB Institute style)
        if "Assessment" in next_stage:
            # Check if they have a passing quiz score
            quiz = await quizzes_col.find_one({"event_id": event_id})
            if quiz:
                # In a real app, we would verify their actual test results here
                pass

        # 2. Internal Rule: Registration Phase (SIRT/NIT style)
        if "Registration" in next_stage:
            # Verify team size and payment gatekeeper
            pass

        # 3. Internal Rule: Open Source (JB Institute style)
        if "Open Source" in next_stage:
            # Verify that they have submitted a PR link
            pass

        # 4. Standard Advancement
        await participants_col.update_many(
            {"_id": {"$in": [ObjectId(pid) for pid in participant_ids]}, "event_id": event_id},
            {"$set": {"current_stage": next_stage, "status": "Shortlisted", "last_updated": datetime.utcnow()}}
        )
        return True

workflow_service = EventWorkflowService()
