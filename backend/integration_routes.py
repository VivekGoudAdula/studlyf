from datetime import datetime
import asyncio
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from services.email_service import send_notification_email
from services.institutional_analytics_service import analytics_service
from services.institutional_certificate_service import certificate_service
from services.leaderboard_service import leaderboard_service
from db import leaderboard_col, events_col, participants_col, certificates_col
from bson import ObjectId
from services.audit_service import log_admin_action

router = APIRouter(prefix="/api/v1/institution", tags=["Institutional Integration"])

@router.post("/profile")
async def create_institution_profile(profile: dict):
    """Saves a new institution profile to MongoDB."""
    from db import institutions_col
    inst_id = str(profile.get("institution_id", "unknown")).strip()
    
    # CRITICAL: Remove MongoDB's internal _id to avoid immutable field errors
    if "_id" in profile:
        del profile["_id"]
        
    profile["institution_id"] = inst_id 
    profile["updated_at"] = datetime.utcnow()
    
    await institutions_col.update_one(
        {"institution_id": inst_id},
        {"$set": profile},
        upsert=True
    )
    return {"status": "success"}

@router.get("/profile/{institution_id}")
async def get_institution_profile(institution_id: str):
    """Retrieves the full profile of an institution including team and social links."""
    from db import institutions_col
    profile = await institutions_col.find_one({"institution_id": institution_id})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    # Clean ID
    if "_id" in profile:
        profile["_id"] = str(profile["_id"])
    return profile

@router.get("/summary/{institution_id}")
async def fetch_summary(institution_id: str):
    """Dynamically aggregates real-time metrics for the dashboard."""
    return await analytics_service.get_kpi_summary(institution_id)

@router.get("/events/{institution_id}")
async def get_all_events(institution_id: str):
    """Retrieves institutional events filtered by ID."""
    cursor = events_col.find({"institution_id": institution_id})
    events_list = []
    async for event in cursor:
        event["_id"] = str(event["_id"])
        event["participant_count"] = await participants_col.count_documents({"event_id": event["_id"]})
        events_list.append(event)
    return events_list

@router.get("/events/{event_id}/participants")
async def get_event_participants(event_id: str):
    """Retrieves all students registered for a specific event."""
    cursor = participants_col.find({"event_id": event_id})
    students = []
    async for student in cursor:
        student["_id"] = str(student["_id"])
        students.append(student)
    return students

@router.get("/events/{event_id}/qualified-bundle")
async def get_qualified_bundle(event_id: str, stage_name: str, threshold: float = 90.0):
    """
    Advanced Filtering: Bundles teams into Approved, Rejected, or Pending 
    based on a multi-criteria scoring matrix.
    """
    from db import scores_col, teams_col, submissions_col
    
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    if not event: raise HTTPException(status_code=404, detail="Event not found")
    
    # 1. Aggregate scores for all criteria
    pipeline = [
        {"$match": {"event_id": event_id}},
        {"$group": {
            "_id": "$team_id",
            "total_avg_score": {"$avg": "$total_score"},
            "criteria_breakdown": {"$first": "$criteria_scores"}, # Assuming judge scores are stored here
            "judge_count": {"$sum": 1}
        }}
    ]
    results = await scores_col.aggregate(pipeline).to_list(None)
    
    approved = []
    rejected = []
    pending = []
    
    # Total assigned judges count for 'Pending' logic
    total_judges = len(event.get("judges", []))
    
    for res in results:
        team = await teams_col.find_one({"_id": ObjectId(res["_id"])})
        if not team: continue
        
        team_data = {
            "team_id": str(team["_id"]),
            "team_name": team["name"],
            "score": round(res["total_avg_score"], 2),
            "judges_completed": res["judge_count"],
            "is_fully_evaluated": res["judge_count"] >= total_judges
        }
        
        if res["judge_count"] < total_judges:
            pending.append(team_data)
        elif res["total_avg_score"] >= threshold:
            approved.append(team_data)
        else:
            rejected.append(team_data)
            
    # Also find teams with 0 scores (Pending)
    scored_team_ids = [res["_id"] for res in results]
    cursor = teams_col.find({"event_id": event_id, "_id": {"$nin": scored_team_ids}})
    async for team in cursor:
        pending.append({
            "team_id": str(team["_id"]),
            "team_name": team["name"],
            "score": 0,
            "judges_completed": 0,
            "is_fully_evaluated": false
        })

    return {
        "summary": {
            "approved": len(approved),
            "rejected": len(rejected),
            "pending": len(pending)
        },
        "approved": approved,
        "rejected": rejected,
        "pending": pending
    }

@router.post("/events/{event_id}/bulk-notify")
async def send_bulk_selection_emails(event_id: str, data: dict):
    """
    Sends personalized emails to a 'bundle' of selected teams.
    Injects dynamic team names.
    """
    team_ids = data.get("team_ids", [])
    next_stage = data.get("next_stage", "Next Round")
    
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    from db import teams_col, users_col
    
    success_count = 0
    for tid in team_ids:
        team = await teams_col.find_one({"_id": ObjectId(tid)})
        if team:
            # Send to all members of the team
            for member_email in team.get("members", []):
                subject = f"Selection Alert: {team['name']} is moving to {next_stage}!"
                body = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                            <h2 style="color: #6C3BFF;">Congratulations Team {team['name']}!</h2>
                            <p>You have successfully qualified for the <strong>{next_stage}</strong> of <strong>{event['title']}</strong>.</p>
                            <p>Our judges were impressed with your performance!</p>
                            <br>
                            <p><strong>What's Next?</strong><br>Check your dashboard for new submission requirements and deadlines.</p>
                            <br>
                            <p>Best Regards,<br>{event['title']} Organizing Team</p>
                        </div>
                    </body>
                </html>
                """
                asyncio.create_task(send_notification_email(member_email, subject, body))
            
            # Update team status in participants_col if needed
            await participants_col.update_many(
                {"event_id": event_id, "team_id": tid},
                {"$set": {"current_stage": next_stage}}
            )
            success_count += 1
            
    return {"status": "success", "sent_to": success_count}

@router.get("/events/public")
async def get_public_events():
    """PUBLIC: Retrieves live events for student registration."""
    cursor = events_col.find({"status": "Live"})
    events_list = []
    async for event in cursor:
        event["_id"] = str(event["_id"])
        events_list.append(event)
    return events_list

@router.post("/leaderboard/{event_id}/refresh")
async def refresh_leaderboard(event_id: str):
    """Triggers dynamic recalculation of rankings based on latest scores."""
    return await leaderboard_service.calculate_event_leaderboard(event_id)

@router.get("/leaderboard/{event_id}")
async def fetch_leaderboard(event_id: str):
    """Retrieves live event standings based on dynamic judge scoring."""
    if event_id == "active_event":
        # Resolve to latest event
        event = await events_col.find_one({"status": "Live"}, sort=[("created_at", -1)])
        if not event: event = await events_col.find_one({}, sort=[("created_at", -1)])
        if event: event_id = str(event["_id"])

    rankings = await leaderboard_col.find({"event_id": event_id}).sort("rank", 1).to_list(None)
    for r in rankings: r["_id"] = str(r["_id"])
    return rankings

@router.get("/leaderboard/{event_id}/export-pdf")
async def export_leaderboard_pdf(event_id: str):
    """
    Generates a professional PDF report with ranked results 
    and detailed dimension-based breakdowns.
    """
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from io import BytesIO
    from db import leaderboard_col, events_col
    
    if event_id == "active_event":
        event = await events_col.find_one({"status": "Live"}, sort=[("created_at", -1)])
        if not event: event = await events_col.find_one({}, sort=[("created_at", -1)])
        if event: event_id = str(event["_id"])

    # 1. Fetch Data
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    rankings = await leaderboard_col.find({"event_id": event_id}).sort("rank", 1).to_list(None)
    
    # 2. Create PDF Buffer
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    elements = []
    
    # 3. Header
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#6C3BFF'),
        spaceAfter=20,
        alignment=1 # Center
    )
    elements.append(Paragraph(f"{event.get('title', 'Event Results')}", title_style))
    elements.append(Paragraph(f"Official Leaderboard & Performance Report", styles['Heading3']))
    elements.append(Spacer(1, 20))
    
    # 4. Table Data
    data = [["Rank", "Team Name", "Score Breakdown", "Final Score"]]
    for r in rankings:
        # Format criteria breakdown as a string
        breakdown_str = ""
        if r.get("criteria_scores"):
            breakdown_str = "\n".join([f"{k}: {v}" for k, v in r["criteria_scores"].items()])
        else:
            breakdown_str = "Verified Overall Score"
        
        data.append([
            f"#{r['rank']}",
            r['team_name'],
            breakdown_str,
            str(r['total_score'])
        ])
    
    # 5. Table Styling
    t = Table(data, colWidths=[50, 150, 200, 80])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6C3BFF')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(t)
    
    # 6. Build
    doc.build(elements)
    
    # 7. Return PDF
    buffer.seek(0)
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=results.pdf"}
    )

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

    # [INTEGRATION ENHANCEMENT]
    from services.leaderboard_service import leaderboard_service
    from db import results_col
    # Resolving undefined variable 'final_rankings' from original code by using the dynamic service
    final_rankings = await leaderboard_service.calculate_event_leaderboard(event_id)
    winner_ids = [r.get("team_id") or r.get("participant_id") for r in final_rankings[:3]]
    await results_col.update_one({"event_id": event_id}, {"$set": {"winner_ids": winner_ids, "final_rankings": final_rankings}}, upsert=True)

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
        
        # [REAL-TIME NOTIFICATION] Notify Recipients via Email
        for cert in cert_entries:
            # We need the recipient's email. Since it's not in the cert_entry, 
            # we try to find it from the user's record or use a fallback.
            recipient_email = None
            # Heuristic: try to find user by name or look up in participants
            participant = await participants_col.find_one({"full_name": cert["recipient_name"], "event_id": event_id})
            if participant:
                recipient_email = participant.get("email")
            
            if recipient_email:
                subject = f"Congratulations! Your Certificate for {cert['event_title']} is ready"
                rank_text = f"Rank: {cert['rank']}" if cert['rank'] else ""
                body = f"""
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333;">
                        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                            <h2 style="color: #D4AF37;">Congratulations, {cert['recipient_name']}!</h2>
                            <p>You have been awarded a certificate for your achievement in <strong>{cert['event_title']}</strong>.</p>
                            <p><strong>Category:</strong> {cert['category']}</p>
                            {f"<p><strong>Rank:</strong> {cert['rank']}</p>" if cert['rank'] else ""}
                            <br>
                            <p>Your official certificate has been issued and is available in your Studlyf profile.</p>
                            <p>Verification Code: <strong>{cert['verification_code']}</strong></p>
                            <br>
                            <p>Great job on your hard work!</p>
                            <br>
                            <p>Best Regards,<br>Studlyf Team</p>
                        </div>
                    </body>
                </html>
                """
                asyncio.create_task(send_notification_email(recipient_email, subject, body))
    
    return {"status": "Event finalized and leaderboard generated successfully"}

@router.get("/export-summary/{institution_id}")
async def export_institution_summary_csv(institution_id: str):
    """Generates a CSV export of the institutional performance summary."""
    import csv
    import io
    from fastapi.responses import StreamingResponse
    from services.institutional_analytics_service import analytics_service
    
    data = await analytics_service.get_kpi_summary(institution_id)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Metric", "Value"])
    for key, value in data.items():
        writer.writerow([key.replace('_', ' ').title(), value])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=institution_report_{institution_id}.csv"}
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

@router.get("/notifications/{institution_id}")
async def get_notifications(institution_id: str):
    """Retrieves real-time institutional activity alerts."""
    activities = []
    
    # Recent Events
    cursor = events_col.find({"institution_id": institution_id}).sort("created_at", -1).limit(3)
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
    cursor = submissions_col.find({"institution_id": institution_id}).sort("submitted_at", -1).limit(2)
    async for s in cursor:
        activities.append({
            "_id": str(s["_id"]),
            "title": "New Submission",
            "message": f"Team {s.get('team_name')} submitted {s.get('project_title')}",
            "type": "success",
            "time_ago": "Just now"
        })
        
    return activities

@router.get("/submissions/{institution_id}")
async def get_all_submissions(institution_id: str):
    """Retrieves all project submissions filtered by institution."""
    from db import submissions_col
    cursor = submissions_col.find({"institution_id": institution_id})
    subs = []
    async for s in cursor:
        s["_id"] = str(s["_id"])
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
    
    # [REAL-TIME NOTIFICATION] Notify Institution
    inst_id = submission_data.get("institution_id")
    if inst_id:
        from db import institutions_col, events_col
        institution = await institutions_col.find_one({"institution_id": inst_id})
        if institution:
            notif_settings = institution.get("notifications", {})
            admin_alerts = notif_settings.get("admin_alerts", {})
            if admin_alerts.get("new_submissions", False):
                inst_email = institution.get("email")
                if inst_email:
                    event = await events_col.find_one({"_id": ObjectId(submission_data.get("event_id"))})
                    event_title = event.get("title", "Event") if event else "Event"
                    
                    inst_subject = f"New Submission: {event_title}"
                    inst_body = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; color: #333;">
                            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                                <h2 style="color: #10B981;">New Project Submitted!</h2>
                                <p>Hello Admin,</p>
                                <p>A team has just submitted their project for <strong>{event_title}</strong>.</p>
                                <p><strong>Team Name:</strong> {submission_data.get('team_name', 'N/A')}</p>
                                <p><strong>Project Title:</strong> {submission_data.get('project_title', 'N/A')}</p>
                                <br>
                                <p>You can review the submission in your dashboard.</p>
                                <br>
                                <p>Best Regards,<br>Studlyf Institution Network</p>
                            </div>
                        </body>
                    </html>
                    """
                    asyncio.create_task(send_notification_email(inst_email, inst_subject, inst_body))

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
    """
    Saves a judge's evaluation with support for multiple criteria 
    (Innovation, UI, etc.) and auto-calculates total.
    """
    from db import scores_col, submissions_col, teams_col
    from datetime import datetime
    
    # 1. Logic: Extract criteria and calculate total safely
    criteria_scores = score_data.get("criteria_scores", {})
    total_score = sum(criteria_scores.values()) if criteria_scores else score_data.get("total_score", 0)
    
    evaluation_entry = {
        "event_id": score_data.get("event_id"),
        "team_id": score_data.get("team_id"),
        "submission_id": score_data.get("submission_id"),
        "judge_email": score_data.get("judge_email"),
        "criteria_scores": criteria_scores,
        "total_score": total_score,
        "feedback": score_data.get("feedback", ""),
        "evaluated_at": datetime.utcnow()
    }
    
    await scores_col.insert_one(evaluation_entry)
    
    # 2. Update submission status
    await submissions_col.update_one(
        {"_id": ObjectId(score_data["submission_id"])},
        {"$set": {"status": "Scored"}}
    )
    
    # 3. NOTIFY ADMIN (If enabled)
    from db import events_col, institutions_col
    event = await events_col.find_one({"_id": ObjectId(score_data["event_id"])})
    if event:
        institution = await institutions_col.find_one({"institution_id": event["institution_id"]})
        if institution:
            notif_settings = institution.get("notifications", {}).get("admin_alerts", {})
            if notif_settings.get("judge_evaluations", True):
                inst_email = institution.get("email")
                if inst_email:
                    team = await teams_col.find_one({"_id": ObjectId(score_data["team_id"])})
                    team_name = team["name"] if team else "a team"
                    
                    subject = f"Judge Action: {team_name} Scored ({total_score}/100)"
                    body = f"""
                    <html>
                        <body style="font-family: Arial, sans-serif; color: #333;">
                            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                                <h2 style="color: #6C3BFF;">Evaluation Complete</h2>
                                <p>Hello Admin,</p>
                                <p>A judge has finished evaluating <strong>{team_name}</strong> for the event: <strong>{event['title']}</strong>.</p>
                                <div style="background: #f8f9ff; padding: 15px; border-radius: 10px; border-left: 4px solid #6C3BFF;">
                                    <p style="margin: 0;"><strong>Final Score:</strong> {total_score} / 100</p>
                                </div>
                                <br>
                                <p>The team has been updated in your <strong>Selection Command Center</strong>.</p>
                                <br>
                                <p>Best Regards,<br>Studlyf Evaluation Network</p>
                            </div>
                        </body>
                    </html>
                    """
                    asyncio.create_task(send_notification_email(inst_email, subject, body))

    await log_admin_action(score_data.get("judge_email", "judge@eval.com"), "SUBMISSION_SCORED", f"Scored team {score_data.get('team_id')}")
    return {"status": "success", "total_score": total_score}

@router.get("/analytics/{institution_id}/timeline")
async def get_analytics_timeline(institution_id: str):
    """Retrieves the 30-day registration timeline for a specific institution."""
    return await analytics_service.get_registration_timeline(institution_id)

@router.get("/analytics/{institution_id}/departments")
async def get_analytics_departments(institution_id: str):
    """Retrieves the departmental participation breakdown."""
    return await analytics_service.get_departmental_breakdown(institution_id)

@router.get("/analytics/{institution_id}/score-distribution")
async def get_score_distribution(institution_id: str):
    """Retrieves score frequency distribution from real data."""
    from db import scores_col, submissions_col
    
    # Simple aggregation to count scores in buckets
    pipeline = [
        # Match scores for submissions belonging to this institution
        {"$lookup": {
            "from": "submissions",
            "localField": "submission_id",
            "foreignField": "_id",
            "as": "submission"
        }},
        {"$unwind": "$submission"},
        {"$match": {"submission.institution_id": institution_id}},
        {"$project": {
            "bucket": {
                "$switch": {
                    "branches": [
                        {"case": {"$lte": ["$total_score", 20]}, "then": "0-20"},
                        {"case": {"$lte": ["$total_score", 40]}, "then": "21-40"},
                        {"case": {"$lte": ["$total_score", 60]}, "then": "41-60"},
                        {"case": {"$lte": ["$total_score", 80]}, "then": "61-80"}
                    ],
                    "default": "81-100"
                }
            }
        }},
        {"$group": {"_id": "$bucket", "count": {"$sum": 1}}},
        {"$project": {"range": "$_id", "count": 1, "_id": 0}}
    ]
    
    results = await scores_col.aggregate(pipeline).to_list(None)
    
    # Ensure all ranges are present even if count is 0
    ranges = ["0-20", "21-40", "41-60", "61-80", "81-100"]
    final_results = []
    for r in ranges:
        match = next((item for item in results if item["range"] == r), None)
        final_results.append(match if match else {"range": r, "count": 0})
        
    return final_results

@router.get("/analytics/{institution_id}/submission-distribution")
async def get_submission_distribution(institution_id: str):
    """Retrieves submissions per event from real data."""
    from db import submissions_col
    
    pipeline = [
        {"$match": {"institution_id": institution_id}},
        {"$lookup": {
            "from": "events",
            "localField": "event_id",
            "foreignField": "_id",
            "as": "event_info"
        }},
        {"$unwind": "$event_info"},
        {"$group": {"_id": "$event_info.title", "count": {"$sum": 1}}},
        {"$project": {"event": "$_id", "count": 1, "_id": 0}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    
    return await submissions_col.aggregate(pipeline).to_list(None)

@router.get("/export-summary/{institution_id}")
async def export_institution_summary(institution_id: str):
    """Generates and returns an executive summary report for the institution."""
    return {"message": "Export feature coming soon", "institution_id": institution_id}

@router.get("/profile/{institution_id}")
async def get_institution_profile(institution_id: str):
    """Retrieves the official institutional profile data."""
    from db import institutions_col
    inst_id = institution_id.strip()
    profile = await institutions_col.find_one({"institution_id": inst_id})
    if not profile:
        return {
            "name": "Certified",
            "website": "https://institution.edu",
            "email": "admin@institution.com",
            "phone": "+1 (555) 000-1234",
            "bio": "A premier educational institution dedicated to fostering innovation.",
            "logo_url": ""
        }
    profile["_id"] = str(profile["_id"])
    return profile

@router.patch("/submissions/{submission_id}/status")
async def update_submission_status(submission_id: str, status_update: dict):
    """Updates the review status and records internal processing notes (PRs, Venue, etc)."""
    from db import submissions_col
    update_fields = {
        "status": status_update["status"],
        "internal_notes": status_update.get("notes", status_update.get("internal_notes", "")),
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
        # Ensure stages is always a list
        if "stages" not in event:
            event["stages"] = []
    return event

@router.patch("/events/{event_id}")
async def update_event_details(event_id: str, update_data: dict):
    """Updates general event information."""
    from db import events_col
    if "_id" in update_data: del update_data["_id"]
    await events_col.update_one({"_id": ObjectId(event_id)}, {"$set": update_data})
    return {"status": "success"}

@router.post("/events/{event_id}/stages")
async def add_event_stage(event_id: str, stage: dict):
    """Adds a new stage to an event's workflow."""
    from db import events_col
    import uuid
    stage["id"] = str(uuid.uuid4())
    stage["created_at"] = datetime.utcnow()
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$push": {"stages": stage}}
    )
    return {"status": "success", "stage_id": stage["id"]}

@router.put("/events/{event_id}/stages/{stage_id}")
async def update_event_stage(event_id: str, stage_id: str, stage_update: dict):
    """Updates a specific stage within an event."""
    from db import events_col
    # MongoDB positional update for array
    await events_col.update_one(
        {"_id": ObjectId(event_id), "stages.id": stage_id},
        {"$set": {"stages.$": stage_update}}
    )
    return {"status": "success"}

@router.delete("/events/{event_id}/stages/{stage_id}")
async def delete_event_stage(event_id: str, stage_id: str):
    """Removes a stage from an event's workflow."""
    from db import events_col
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"stages": {"id": stage_id}}}
    )
    return {"status": "success"}

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

@router.post("/events/{event_id}/judges")
async def add_event_judge(event_id: str, judge_data: dict):
    """
    Adds a judge to an event and sends an invitation email.
    """
    event = await events_col.find_one({"_id": ObjectId(event_id)})
    if not event: raise HTTPException(status_code=404, detail="Event not found")
    
    # Check if judge already exists
    current_judges = event.get("judges", [])
    if any(j.get("email") == judge_data.get("email") for j in current_judges):
        return {"status": "exists", "message": "Judge already assigned"}
    
    judge_entry = {
        "id": str(ObjectId()),
        "name": judge_data.get("name"),
        "email": judge_data.get("email"),
        "expertise": judge_data.get("expertise"),
        "status": "INVITED",
        "assigned_at": datetime.utcnow().isoformat()
    }
    
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$push": {"judges": judge_entry}}
    )
    
    # TRIGGER EMAIL
    subject = f"Invitation: Judge for {event['title']}"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
                <h2 style="color: #6C3BFF;">Judging Invitation</h2>
                <p>Hello <strong>{judge_entry['name']}</strong>,</p>
                <p>You have been invited by <strong>{event.get('institution_name', 'The Institution')}</strong> to be a judge for the event: <strong>{event['title']}</strong>.</p>
                <p>Your expertise in <strong>{judge_entry['expertise']}</strong> is highly valued for this role.</p>
                <br>
                <p>Please log in to the Studlyf Judge Portal using your email to review submissions.</p>
                <br>
                <p>Best Regards,<br>Studlyf Institution Network</p>
            </div>
        </body>
    </html>
    """
    asyncio.create_task(send_notification_email(judge_entry['email'], subject, body))
    
    return {"status": "success", "judge": judge_entry}

@router.delete("/events/{event_id}/judges/{judge_email}")
async def remove_event_judge(event_id: str, judge_email: str):
    """Removes a judge from an event."""
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$pull": {"judges": {"email": judge_email}}}
    )
    return {"status": "success"}

@router.post("/events/{event_id}/criteria")
async def update_judging_criteria(event_id: str, criteria_data: List[dict]):
    """
    Updates the scoring rubrics for an event.
    """
    await events_col.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": {"judging_criteria": criteria_data, "updated_at": datetime.utcnow()}}
    )
    return {"status": "success"}

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

# ============================================================
# EXPORT & DISTRIBUTION ENDPOINTS (Blueprint Requirements)
# ============================================================

# Removed duplicate unscoped export route

@router.get("/leaderboard/{event_id}/export-pdf")
async def export_leaderboard_pdf(event_id: str):
    """Generates a PDF export of the leaderboard for a specific event."""
    from fastapi.responses import FileResponse
    from db import scores_col, submissions_col, teams_col
    import os

    # Resolve placeholders
    if event_id in ["active_event", "ALL"]:
        event = await events_col.find_one({"status": "Live"}, sort=[("created_at", -1)])
        if not event: event = await events_col.find_one({}, sort=[("created_at", -1)])
        if event: 
            event_id = str(event["_id"])
            event_title = event.get("title", "Event") if event_id != "ALL" else "All Events Master Leaderboard"
        else: 
            raise HTTPException(status_code=404, detail="No events found to export.")
    else:
        event = await events_col.find_one({"_id": ObjectId(event_id)})
        event_title = event.get("title", "Event")
    
    # Aggregate scores (if ALL, we match all scores, otherwise just the specific event)
    match_query = {} if event_id == "ALL" else {"event_id": event_id}
    pipeline = [
        {"$match": match_query},
        {"$group": {"_id": "$submission_id", "avg_score": {"$avg": "$total_score"}}},
        {"$sort": {"avg_score": -1}}
    ]
    results = await scores_col.aggregate(pipeline).to_list(100)

    # Build simple HTML table for PDF
    rows_html = ""
    for rank, r in enumerate(results, 1):
        sub = await submissions_col.find_one({"_id": ObjectId(r["_id"])}) if r.get("_id") else None
        team_name = "Individual"
        if sub and sub.get("team_id"):
            team = await teams_col.find_one({"_id": ObjectId(sub["team_id"])})
            team_name = team.get("team_name", "Team") if team else "Team"
        project = sub.get("project_title", "N/A") if sub else "N/A"
        rows_html += f"<tr><td>{rank}</td><td>{team_name}</td><td>{project}</td><td>{round(r['avg_score'], 2)}</td></tr>"

    html_content = f"""
    <html><head><style>
        body {{ font-family: Arial, sans-serif; padding: 40px; }}
        h1 {{ color: #1e293b; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
        th, td {{ border: 1px solid #e2e8f0; padding: 12px; text-align: left; }}
        th {{ background: #1e293b; color: white; }}
        tr:nth-child(even) {{ background: #f8fafc; }}
    </style></head><body>
        <h1>{event_title} — Final Leaderboard</h1>
        <p>Generated: {datetime.utcnow().strftime('%B %d, %Y')}</p>
        <table><tr><th>Rank</th><th>Team</th><th>Project</th><th>Score</th></tr>{rows_html}</table>
    </body></html>"""

    os.makedirs("artifacts/exports", exist_ok=True)
    pdf_path = f"artifacts/exports/leaderboard_{event_id}.pdf"
    try:
        from weasyprint import HTML as WPHTML
        WPHTML(string=html_content).write_pdf(pdf_path)
    except ImportError:
        # Fallback: return HTML if weasyprint not available
        html_path = f"artifacts/exports/leaderboard_{event_id}.html"
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)
        return FileResponse(html_path, media_type="text/html", filename=f"leaderboard_{event_title}.html")

    return FileResponse(pdf_path, media_type="application/pdf", filename=f"leaderboard_{event_title}.pdf")

# Removed duplicate unscoped analytics routes
@router.get("/export-participants/{institution_id}")
async def export_institution_participants(institution_id: str):
    """Generates a CSV export of all registered participants for the institution."""
    from fastapi.responses import StreamingResponse
    import csv
    import io
    
    cursor = participants_col.find({"institution_id": institution_id})
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name", "Email", "Phone", "Event ID", "Status", "Joined Date"])
    
    async for p in cursor:
        writer.writerow([
            p.get("full_name") or p.get("name", "N/A"),
            p.get("email", "N/A"),
            p.get("phone", "N/A"),
            p.get("event_id", "N/A"),
            p.get("status", "N/A"),
            p.get("created_at", "N/A")
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=participants_{institution_id}.csv"}
    )
