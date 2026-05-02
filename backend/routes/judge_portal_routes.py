"""
Judge Portal Routes - Comprehensive judging system
"""
from fastapi import APIRouter, HTTPException, Body, Depends, Query
from typing import Optional, List, Dict, Any
from auth_institution import get_auth_user
from judge_portal_service import judge_portal_service
from services.email_service import send_notification_email
from notification_helpers import notify_institution
from bson import ObjectId
from datetime import datetime, timezone
import os

router = APIRouter(prefix="/api/judge-portal", tags=["Judge Portal"])

# Judge Invitation Management
@router.post("/invite")
async def create_judge_invitation(
    event_id: str = Body(...),
    judge_data: dict = Body(...),
    user: dict = Depends(get_auth_user)
):
    """Create and send judge invitation for an event"""
    
    # Verify user has institution access
    from auth_institution import assert_institution_owns_event
    event = await assert_institution_owns_event(event_id, user)
    
    # Create invitation
    result = await judge_portal_service.create_judge_invitation(
        event_id, judge_data, user.get("institution_id")
    )
    
    return result

@router.post("/respond")
async def respond_to_invitation(
    token: str = Body(...),
    accept: bool = Body(...),
):
    """Respond to judge invitation (accept/decline)"""
    
    # Get the email from the invitation token instead of auth user
    from db import judges_col
    judge = await judges_col.find_one({"invitation_token": token})
    if not judge:
        raise HTTPException(status_code=404, detail="Invalid invitation token")
        
    result = await judge_portal_service.respond_to_invitation(
        token, accept, judge.get("email", "")
    )
    
    return result

@router.get("/invitation-details")
async def get_invitation_details(token: str):
    """Get details for a specific invitation using its token"""
    from db import judges_col, events_col
    
    judge = await judges_col.find_one({"invitation_token": token})
    if not judge:
        raise HTTPException(status_code=404, detail="Invalid or expired invitation token")
        
    event = await events_col.find_one({"_id": ObjectId(judge["event_id"])})
    
    return {
        "event_id": judge["event_id"],
        "event_name": event.get("title", event.get("name", "Unknown Event")) if event else "Unknown Event",
        "judge_name": judge.get("name", "Judge"),
        "expertise": judge.get("expertise", []),
        "status": judge.get("status", "INVITED"),
        "invitation_sent_at": judge.get("invitation_sent_at", "")
    }

@router.get("/invitations")
async def get_my_invitations(user: dict = Depends(get_auth_user)):
    """Get pending invitations for current user"""
    
    email = user.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    from db import judges_col, events_col
    
    # Get invited/accepted judges for this user
    judge_records = []
    async for judge in judges_col.find({"email": email, "status": {"$in": ["INVITED", "ACCEPTED"]}}):
        # Get event details
        event = await events_col.find_one({"_id": ObjectId(judge["event_id"])})
        
        judge_info = {
            "_id": str(judge["_id"]),
            "event_id": judge["event_id"],
            "event_name": event.get("name", "Unknown Event") if event else "Unknown Event",
            "status": judge["status"],
            "invitation_sent_at": judge.get("invitation_sent_at", ""),
            "responded_at": judge.get("responded_at", ""),
            "expertise": judge.get("expertise", ""),
            "invitation_token": judge.get("invitation_token", "")
        }
        judge_records.append(judge_info)
    
    return judge_records

# Judge Assignment and Evaluation
@router.get("/assignments")
async def get_my_assignments(
    event_id: Optional[str] = Query(None),
    user: dict = Depends(get_auth_user)
):
    """Get all submissions assigned to current judge"""
    
    email = user.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    assignments = await judge_portal_service.get_judge_assignments(email, event_id)
    return assignments

@router.get("/assignments/{submission_id}")
async def get_assignment_details(
    submission_id: str,
    user: dict = Depends(get_auth_user)
):
    """Get detailed information for a specific assignment"""
    
    email = user.get("email", "").lower().strip()
    assignments = await judge_portal_service.get_judge_assignments(email)
    
    # Find specific assignment
    assignment = None
    for a in assignments:
        if a["_id"] == submission_id:
            assignment = a
            break
    
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    return assignment

@router.post("/evaluate/{submission_id}")
async def submit_evaluation(
    submission_id: str,
    scores: dict = Body(...),
    comments: str = Body(...),
    user: dict = Depends(get_auth_user)
):
    """Submit evaluation for a submission"""
    
    email = user.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    result = await judge_portal_service.submit_evaluation(
        email, submission_id, scores, comments
    )
    
    return result

@router.get("/criteria/{event_id}")
async def get_evaluation_criteria(
    event_id: str,
    user: dict = Depends(get_auth_user)
):
    """Get evaluation criteria for an event"""
    
    email = user.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    criteria = await judge_portal_service.get_evaluation_criteria(event_id, email)
    return criteria

# Judge Dashboard
@router.get("/dashboard")
async def get_judge_dashboard(user: dict = Depends(get_auth_user)):
    """Get judge dashboard overview"""
    
    email = user.get("email", "").lower().strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email required")
    
    from db import judges_col, events_col, submissions_col, scores_col
    
    # Get judge statistics
    judge_stats = {
        "total_events": 0,
        "pending_evaluations": 0,
        "completed_evaluations": 0,
        "upcoming_deadlines": 0
    }
    
    # Get accepted judge records
    async for judge in judges_col.find({"email": email, "status": "ACCEPTED"}):
        judge_stats["total_events"] += 1
        
        # Get event details
        event = await events_col.find_one({"_id": ObjectId(judge["event_id"])})
        if event:
            # Check deadline
            if event.get("submission_deadline"):
                deadline = datetime.fromisoformat(event["submission_deadline"].replace('Z', '+00:00'))
                if deadline > datetime.now(timezone.utc):
                    judge_stats["upcoming_deadlines"] += 1
    
    # Get assignments
    assignments = await judge_portal_service.get_judge_assignments(email)
    
    for assignment in assignments:
        if assignment.get("existing_scores"):
            judge_stats["completed_evaluations"] += 1
        else:
            judge_stats["pending_evaluations"] += 1
    
    # Get recent activity
    recent_activity = []
    async for score in scores_col.find({"judge_email": email}).sort("created_at", -1).limit(5):
        submission = await submissions_col.find_one({"_id": ObjectId(score["submission_id"])})
        if submission:
            event = await events_col.find_one({"_id": ObjectId(submission["event_id"])})
            recent_activity.append({
                "submission_id": str(submission["_id"]),
                "submission_title": submission.get("title", "Untitled"),
                "event_name": event.get("name", "Unknown Event") if event else "Unknown Event",
                "evaluated_at": score.get("created_at", ""),
                "average_score": sum(score.get("scores", {}).values()) / len(score.get("scores", {})) if score.get("scores") else 0
            })
    
    return {
        "stats": judge_stats,
        "recent_activity": recent_activity,
        "assignments_count": len(assignments)
    }

# Institution Management
@router.get("/institution/{institution_id}/judges")
async def get_institution_judges(
    institution_id: str,
    event_id: Optional[str] = Query(None),
    user: dict = Depends(get_auth_user)
):
    """Get all judges for an institution (institution admin only)"""
    
    # Verify institution access
    from auth_institution import assert_institution_scope
    assert_institution_scope(institution_id, user)
    
    from db import judges_col, events_col
    
    query = {"institution_id": institution_id}
    if event_id:
        query["event_id"] = event_id
    
    judges = []
    async for judge in judges_col.find(query):
        # Get event details
        event = await events_col.find_one({"_id": ObjectId(judge["event_id"])})
        
        judge_info = {
            "_id": str(judge["_id"]),
            "name": judge.get("name", ""),
            "email": judge.get("email", ""),
            "expertise": judge.get("expertise", ""),
            "status": judge.get("status", ""),
            "event_id": judge.get("event_id", ""),
            "event_name": event.get("name", "Unknown Event") if event else "Unknown Event",
            "invitation_sent_at": judge.get("invitation_sent_at", ""),
            "responded_at": judge.get("responded_at", "")
        }
        judges.append(judge_info)
    
    return judges

@router.post("/institution/{institution_id}/assign-judges")
async def assign_judges_to_submissions(
    institution_id: str,
    event_id: str = Body(...),
    assignment_config: dict = Body(...),
    user: dict = Depends(get_auth_user)
):
    """Assign judges to submissions (institution admin only)"""
    
    # Verify institution access
    from auth_institution import assert_institution_scope, assert_institution_owns_event
    assert_institution_scope(institution_id, user)
    await assert_institution_owns_event(event_id, user)
    
    from db import judges_col, submissions_col
    
    # Get accepted judges for event
    accepted_judges = []
    async for judge in judges_col.find({"event_id": event_id, "status": "ACCEPTED"}):
        accepted_judges.append(judge)
    
    if not accepted_judges:
        raise HTTPException(status_code=400, detail="No accepted judges found for this event")
    
    # Get submitted submissions
    submissions = []
    async for submission in submissions_col.find({"event_id": event_id, "status": "Submitted"}):
        submissions.append(submission)
    
    # Assignment strategy
    assignment_type = assignment_config.get("type", "round_robin")  # round_robin, random, expert_based
    judges_per_submission = assignment_config.get("judges_per_submission", 2)
    
    assigned_count = 0
    for submission in submissions:
        # Select judges for this submission
        selected_judges = []
        
        if assignment_type == "round_robin":
            # Simple round-robin assignment
            judge_index = assigned_count % len(accepted_judges)
            for i in range(judges_per_submission):
                idx = (judge_index + i) % len(accepted_judges)
                selected_judges.append(accepted_judges[idx])
        
        elif assignment_type == "random":
            # Random assignment
            import random
            selected_judges = random.sample(accepted_judges, min(judges_per_submission, len(accepted_judges)))
        
        elif assignment_type == "expert_based":
            # Expertise-based assignment (simplified)
            submission_expertise = submission.get("required_expertise", [])
            for judge in accepted_judges:
                if len(selected_judges) >= judges_per_submission:
                    break
                # Simple expertise matching
                if any(exp.lower() in judge.get("expertise", "").lower() for exp in submission_expertise):
                    selected_judges.append(judge)
            
            # Fill remaining slots randomly if needed
            if len(selected_judges) < judges_per_submission:
                remaining_judges = [j for j in accepted_judges if j not in selected_judges]
                import random
                additional = random.sample(
                    remaining_judges, 
                    min(judges_per_submission - len(selected_judges), len(remaining_judges))
                )
                selected_judges.extend(additional)
        
        # Update submission with assigned judges
        if selected_judges:
            judge_emails = [judge["email"] for judge in selected_judges]
            await submissions_col.update_one(
                {"_id": submission["_id"]},
                {
                    "$set": {
                        "assigned_judge_emails": judge_emails,
                        "assigned_at": datetime.now(timezone.utc).isoformat(),
                        "status": "Under Review"
                    }
                }
            )
            assigned_count += 1
    
    # Create notification
    await notify_institution(
        institution_id,
        f"Assigned judges to {assigned_count} submissions",
        ntype="judges_assigned",
        title="Judges Assigned",
        meta={
            "event_id": event_id,
            "assigned_count": assigned_count,
            "assignment_type": assignment_type
        }
    )
    
    return {
        "status": "success",
        "assigned_submissions": assigned_count,
        "judges_used": len(accepted_judges),
        "assignment_type": assignment_type
    }

@router.get("/events/{event_id}/leaderboard")
async def get_event_leaderboard(event_id: str):
    """Get the real-time leaderboard for an event based on judge scores"""
    from db import submissions_col, scores_col, teams_col
    
    # 1. Get all submissions for this event
    submissions = []
    async for sub in submissions_col.find({"event_id": event_id}):
        submissions.append(sub)
        
    if not submissions:
        return []
        
    leaderboard = []
    
    for sub in submissions:
        # 2. Get all scores for this submission
        sub_scores = []
        async for score_doc in scores_col.find({"submission_id": str(sub["_id"])}):
            # Calculate average score for this specific judge's evaluation
            criteria_scores = score_doc.get("scores", {})
            if criteria_scores:
                avg = sum(criteria_scores.values()) / len(criteria_scores)
                sub_scores.append(avg)
        
        # 3. Calculate team's overall average across all judges
        team_avg = sum(sub_scores) / len(sub_scores) if sub_scores else 0
        
        # 4. Get team info
        team_name = sub.get("team_name", "Unknown Team")
        if sub.get("team_id"):
             team = await teams_col.find_one({"_id": ObjectId(sub["team_id"])})
             if team:
                 team_name = team.get("name", team_name)
                 
        leaderboard.append({
            "team_id": sub.get("team_id"),
            "team_name": team_name,
            "project_title": sub.get("project_title", sub.get("title", "Untitled")),
            "score": round(team_avg, 2),
            "evaluations_count": len(sub_scores),
            "status": sub.get("status", "Submitted")
        })
        
    # 5. Sort by score descending
    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    
    # 6. Add rank
    for idx, item in enumerate(leaderboard):
        item["rank"] = idx + 1
        
    return leaderboard

