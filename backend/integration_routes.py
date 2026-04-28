from datetime import datetime
from fastapi import APIRouter, HTTPException
from .services.institutional_analytics_service import analytics_service
from .services.institutional_certificate_service import certificate_service
from db import leaderboard_col, events_col, participants_col, certificates_col
from bson import ObjectId
from services.audit_service import log_admin_action

router = APIRouter(prefix="/api/v1/institution", tags=["Institutional Integration"])

@router.get("/summary/{institution_id}")
async def fetch_summary(institution_id: str):
    """Dynamically aggregates real-time metrics for the dashboard."""
    return await analytics_service.get_kpi_summary(institution_id)

@router.get("/events")
async def get_all_events():
    """Retrieves all institutional events with participation counts."""
    cursor = events_col.find({})
    events_list = []
    async for event in cursor:
        event["_id"] = str(event["_id"])
        # Add dynamic participant count
        event["participant_count"] = await participants_col.count_documents({"event_id": event["_id"]})
        events_list.append(event)
    return events_list

@router.get("/events/public")
async def get_public_events():
    """PUBLIC: Retrieves live events for student registration."""
    cursor = events_col.find({"status": "Live"})
    events_list = []
    async for event in cursor:
        event["_id"] = str(event["_id"])
        events_list.append(event)
    return events_list

@router.get("/leaderboard/{event_id}")
async def fetch_leaderboard(event_id: str):
    """Retrieves live event standings based on dynamic judge scoring."""
    rankings = await leaderboard_col.find({"event_id": event_id}).sort("rank", 1).to_list(None)
    for r in rankings: r["_id"] = str(r["_id"])
    return rankings

@router.post("/finalize-event/{event_id}")
async def finalize_event(event_id: str):
    """
    Triggers final results processing and bulk leaderboard generation.
    Transitions event status from LIVE to ENDED.
    """
    from db import scores_col, leaderboard_col, submissions_col
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    if not event: raise HTTPException(status_code=404, detail="Event not found")
    
    # 1. Aggregate scores to calculate rankings
    pipeline = [
        {"$match": {"event_id": event_id}},
        {"$group": {
            "_id": "$submission_id",
            "total_score": {"$avg": {"$add": ["$innovation", "$technicality", "$impact", "$presentation"]}}
        }},
        {"$sort": {"total_score": -1}}
    ]
    
    rankings = await scores_col.aggregate(pipeline).to_list(None)
    
    # 2. Save rankings to Leaderboard
    for idx, rank in enumerate(rankings):
        submission = await submissions_col.find_one({"_id": ObjectId(rank["_id"])})
        leaderboard_entry = {
            "event_id": event_id,
            "team_name": submission.get("team_name", "Unknown"),
            "project_title": submission.get("project_title", "Untitled"),
            "total_score": round(rank["total_score"], 2),
            "rank": idx + 1,
            "finalized_at": datetime.utcnow()
        }
        await leaderboard_col.update_one(
            {"event_id": event_id, "team_name": leaderboard_entry["team_name"]},
            {"$set": leaderboard_entry},
            upsert=True
        )

    # 3. Mark event as ended
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": {"status": "ENDED", "finalized_at": datetime.utcnow()}}
    )

    # 4. Generate Certificates for Winners
    await generate_event_certificates(event_id, final_rankings)

    await log_admin_action("admin@institution.com", "EVENT_FINALIZED", f"Finalized event {event_id} and generated certificates.")
    return {"status": "success", "results": final_rankings}

async def generate_event_certificates(event_id: str, rankings: list):
    """Generates individual certificates for all members of the top teams."""
    from db import certificates_col, teams_col, events_col
    import uuid
    
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    event_type = event.get("event_type", "Hackathon")
    
    cert_entries = []
    for rank_data in rankings:
        # Fetch the team to get all member names
        team = await teams_col.find_one({"team_name": rank_data["team_name"], "event_id": event_id})
        members = team.get("members", []) if team else [{"full_name": rank_data["team_name"]}]
        
        for member in members:
            cert_entries.append({
                "certificate_id": str(uuid.uuid4()),
                "verification_code": uuid.uuid4().hex[:12].upper(),
                "event_id": event_id,
                "event_title": event.get("title"),
                "event_type": event_type,
                "recipient_name": member.get("full_name", "Participant"),
                "team_name": rank_data["team_name"],
                "rank": rank_data["rank"] if event_type in ["Hackathon", "Competition"] else None,
                "category": "Winner" if rank_data["rank"] <= 3 else "Participant",
                "issued_date": datetime.utcnow().isoformat(),
                "verification_url": f"/verify/cert/{uuid.uuid4().hex[:10]}",
                "status": "ISSUED"
            })
    
    if cert_entries:
        await certificates_col.insert_many(cert_entries)
    
    return {"status": "Event finalized and leaderboard generated successfully"}

@router.get("/export-summary")
async def export_summary():
    """Generates a CSV export of the institutional performance summary."""
    import csv
    import io
    from fastapi.responses import StreamingResponse
    from .services.institutional_analytics_service import analytics_service
    
    data = await analytics_service.get_kpi_summary("default_inst")
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    for key, value in data.items():
        writer.writerow([key.replace('_', ' ').title(), value])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=institution_report.csv"}
    )

@router.get("/verify-certificate/{certificate_id}")
async def verify_certificate(certificate_id: str):
    """
    PUBLIC ENDPOINT: Validates a certificate and returns its details.
    Used by the public verification page.
    """
    cert = await certificates_col.find_one({"certificate_id": certificate_id})
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found or invalid.")
    
    # Return professional snapshot
    return {
        "recipient": cert.get("recipient_name"),
        "event": "Competition Achievement", # Ideally fetch from event_id
        "rank": cert.get("rank"),
        "issued_date": cert.get("issued_at"),
        "status": "VALIDATED",
        "institution": "Certified Institution Network"
    }

@router.get("/notifications")
async def get_notifications():
    """Retrieves real-time institutional activity alerts."""
    # In a real system, we would query a notifications collection.
    # For now, we aggregate recent events and submissions as activity.
    activities = []
    
    # Recent Events
    cursor = events_col.find().sort("created_at", -1).limit(3)
    async for e in cursor:
        activities.append({
            "_id": str(e["_id"]),
            "title": "New Event Created",
            "message": f"{e['title']} has been added to the portal.",
            "type": "info",
            "time_ago": "Recently"
        })
    
    # Recent Submissions
    from db import submissions_col
    cursor = submissions_col.find().sort("submitted_at", -1).limit(2)
    async for s in cursor:
        activities.append({
            "_id": str(s["_id"]),
            "title": "New Submission",
            "message": f"Team {s.get('team_name')} submitted {s.get('project_title')}",
            "type": "success",
            "time_ago": "Just now"
        })
        
    return activities

@router.get("/submissions")
async def get_all_submissions():
    """Retrieves all project submissions across all institutional events."""
    from db import submissions_col
    cursor = submissions_col.find({})
    subs = []
    async for s in cursor:
        s["_id"] = str(s["_id"])
        # Format for frontend
        s["submission_date"] = s.get("submitted_at", "2026-04-27")
        subs.append(s)
    return subs

@router.post("/submissions")
async def create_submission(submission_data: dict):
    """
    Creates a new project submission record.
    Fulfills Nithya's core backend responsibility.
    """
    from db import submissions_col
    from datetime import datetime
    
    submission_data["submitted_at"] = datetime.utcnow()
    result = await submissions_col.insert_one(submission_data)
    return {"status": "success", "id": str(result.inserted_id)}

@router.get("/judge/assigned/{judge_id}")
async def get_assigned_projects(judge_id: str):
    """Retrieves all projects assigned to a specific judge."""
    from db import submissions_col
    # In a real system, we would filter by a mapping table.
    # For now, we return all submissions that haven't been scored yet.
    cursor = submissions_col.find({"status": "Submitted"})
    projects = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        projects.append(doc)
    return projects

@router.post("/judge/score")
async def save_judge_score(score_data: dict):
    """Saves a judge's evaluation for a project."""
    from db import scores_col, submissions_col
    from datetime import datetime
    
    score_data["evaluated_at"] = datetime.utcnow()
    await scores_col.insert_one(score_data)
    
    # Update submission status
    await submissions_col.update_one(
        {"_id": ObjectId(score_data["submission_id"])},
        {"$set": {"status": "Scored"}}
    )
    await log_admin_action("judge@institution.com", "SUBMISSION_SCORED", f"Scored submission {score_data['submission_id']}.")
    return {"status": "success"}

@router.get("/analytics/timeline")
async def get_analytics_timeline():
    """Retrieves the 30-day registration timeline."""
    return await analytics_service.get_registration_timeline("default_inst")

@router.get("/analytics/departments")
async def get_analytics_departments():
    """Retrieves the departmental participation breakdown."""
    return await analytics_service.get_departmental_breakdown("default_inst")

@router.patch("/submissions/{submission_id}/status")
async def update_submission_status(submission_id: str, status_update: dict):
    """Updates the review status of a project submission."""
    from db import submissions_col
    await submissions_col.update_one(
        {"_id": ObjectId(submission_id)},
        {"$set": {"status": status_update["status"]}}
    )
    await log_admin_action("admin@institution.com", "SUBMISSION_STATUS_UPDATED", f"Updated submission {submission_id} to {status_update['status']}")
    return {"status": "success"}

@router.get("/profile/{institution_id}")
async def get_institution_profile(institution_id: str):
    """Retrieves the official institutional profile data."""
    from db import institutions_col
    profile = await institutions_col.find_one({"institution_id": institution_id})
    if not profile:
        return {
            "name": "Certified Institution Network",
            "website": "https://institution.edu",
            "email": "admin@institution.com",
            "phone": "+1 (555) 000-1234",
            "bio": "A premier educational institution dedicated to fostering innovation."
        }
    profile["_id"] = str(profile["_id"])
    return profile

@router.patch("/submissions/{submission_id}/status")
async def update_submission_status(submission_id: str, status_update: dict):
    """Updates the review status and records internal processing notes (PRs, Venue, etc)."""
    from db import submissions_col
    update_fields = {
        "status": status_update["status"],
        "internal_notes": status_update.get("notes", ""),
        "pr_links": status_update.get("pr_links", []),
        "processed_at": datetime.utcnow().isoformat()
    }
    await submissions_col.update_one({"_id": ObjectId(submission_id)}, {"$set": update_fields})
    await log_admin_action("admin@institution.com", "SUBMISSION_PROCESSED", f"Processed submission {submission_id} with status {status_update['status']}")
    return {"status": "success"}

@router.patch("/participants/{participant_id}/verify")
async def verify_internal_process(participant_id: str, verification_data: dict):
    """Handles internal verification: Payment (NIT) and Venue Assignment (SIRT)."""
    from db import participants_col
    update_fields = {
        "payment_verified": verification_data.get("payment_verified", False),
        "venue_assignment": verification_data.get("venue_assignment", "N/A"),
        "is_eligible": verification_data.get("is_eligible", True)
    }
    await participants_col.update_one({"_id": ObjectId(participant_id)}, {"$set": update_fields})
    return {"status": "success"}

@router.get("/events/{event_id}/details")
async def get_complex_event_details(event_id: str):
    """Retrieves full event details including stages, fees, and rules."""
    from db import events_col
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    if event:
        event["_id"] = str(event["_id"])
    return event

@router.patch("/events/{event_id}/advance-stage")
async def advance_participants(event_id: str, participant_ids: list, next_stage: str):
    """Internal Process: Advances participants and triggers phase-specific notifications."""
    from db import notifications_col, events_col
    from services.event_workflow_service import workflow_service
    
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    event_title = event.get("title", "Event")

    # 1. Run internal business rules for this specific phase
    from services.event_workflow_service import workflow_service
    await workflow_service.process_phase_transition(event_id, participant_ids, next_stage)

    # 2. Update database (Restored explicit visibility)
    from db import participants_col
    await participants_col.update_many(
        {"_id": {"$in": [ObjectId(pid) for pid in participant_ids]}, "event_id": event_id},
        {"$set": {"current_stage": next_stage, "status": "Shortlisted"}}
    )

    # 2. Trigger Dynamic Notifications/Emails for each participant
    notifs = []
    for pid in participant_ids:
        notifs.append({
            "user_id": pid,
            "event_id": event_id,
            "message": f"Congratulations! You've advanced to the '{next_stage}' stage of {event_title}.",
            "type": "PHASE_ADVANCEMENT",
            "timestamp": datetime.utcnow().isoformat(),
            "is_read": False
        })
    
    if notifs:
        await notifications_col.insert_many(notifs)

    await log_admin_action("admin@institution.com", "STAGE_ADVANCED", f"Advanced {len(participant_ids)} users to {next_stage} in {event_title}")
    return {"status": "success", "notified_count": len(participant_ids)}

@router.get("/events/{event_id}/quizzes")
async def get_event_quizzes(event_id: str):
    """Retrieves all assessments/quizzes linked to a specific event."""
    from db import quizzes_col
    cursor = quizzes_col.find({"event_id": event_id})
    quizzes = await cursor.to_list(length=100)
    for q in quizzes:
        q["_id"] = str(q["_id"])
    return quizzes

@router.post("/events/{event_id}/quizzes")
async def create_event_quiz(event_id: str, quiz_data: dict):
    """Creates a new assessment round with questions and timing."""
    from db import quizzes_col
    quiz_data["event_id"] = event_id
    quiz_data["created_at"] = datetime.utcnow().isoformat()
    result = await quizzes_col.insert_one(quiz_data)
    return {"quiz_id": str(result.inserted_id)}

@router.post("/events/create-professional")
async def create_pro_event(event_data: dict):
    """Creates a high-end event with stages, fees, and prizes."""
    from db import events_col
    event_data["created_at"] = datetime.utcnow()
    event_data["status"] = "DRAFT"
    # Ensure stages structure exists
    if "stages" not in event_data:
        event_data["stages"] = [
            {"name": "Registration", "type": "DEADLINE"},
            {"name": "Submission", "type": "ONLINE"},
            {"name": "Finals", "type": "OFFLINE"}
        ]
    result = await events_col.insert_one(event_data)
    return {"event_id": str(result.inserted_id)}
