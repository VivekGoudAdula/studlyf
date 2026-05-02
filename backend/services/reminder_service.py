from datetime import datetime, timedelta, timezone
from db import events_col, judges_col, submissions_col, notifications_col
from bson import ObjectId
from services.email_service import send_notification_email
import asyncio
import logging

logger = logging.getLogger("reminder_service")

class ReminderService:
    @staticmethod
    async def send_judge_reminders():
        """
        Scans for upcoming deadlines and pings judges with pending assignments.
        Runs periodically via scheduler.
        """
        logger.info("Scanning for upcoming judging deadlines...")
        
        # 1. Find active events with deadlines in the next 24-48 hours
        now = datetime.now(timezone.utc)
        soon = now + timedelta(hours=48)
        
        active_events = []
        async for event in events_col.find({
            "submission_deadline": {"$exists": True}
        }):
            try:
                deadline = datetime.fromisoformat(event["submission_deadline"].replace('Z', '+00:00'))
                if now < deadline <= soon:
                    active_events.append(event)
            except:
                continue
                
        if not active_events:
            logger.info("No urgent judging deadlines found.")
            return

        for event in active_events:
            event_id = str(event["_id"])
            event_name = event.get("title", event.get("name", "Hackathon"))
            
            # 2. Get all submissions for this event that are 'Under Review'
            pending_submissions = []
            async for sub in submissions_col.find({
                "event_id": event_id,
                "status": "Under Review"
            }):
                pending_submissions.append(sub)
                
            if not pending_submissions:
                continue
                
            # 3. Identify unique judges who have pending work
            judges_to_remind = {} # email -> [submission_titles]
            
            for sub in pending_submissions:
                emails = sub.get("assigned_judge_emails", [])
                # If judge hasn't scored yet (check if scores exist for this judge/sub combo)
                from db import scores_col
                for email in emails:
                    score_exists = await scores_col.find_one({
                        "submission_id": str(sub["_id"]),
                        "judge_email": email
                    })
                    if not score_exists:
                        if email not in judges_to_remind:
                            judges_to_remind[email] = []
                        judges_to_remind[email].append(sub.get("project_title", "Untitled Project"))

            # 4. Send emails and in-app notifications
            for email, projects in judges_to_remind.items():
                logger.info(f"Sending reminder to judge: {email} for {len(projects)} projects")
                
                # In-app notification
                judge_user = await judges_col.find_one({"email": email, "event_id": event_id})
                if judge_user:
                    await notifications_col.insert_one({
                        "user_id": judge_user.get("user_id"), # If they are registered users
                        "email": email,
                        "type": "judge_reminder",
                        "title": "Judging Deadline Approaching",
                        "message": f'You have {len(projects)} pending evaluations for "{event_name}". Deadline: {event["submission_deadline"]}',
                        "is_read": False,
                        "created_at": datetime.now(timezone.utc).isoformat(),
                        "meta": {"event_id": event_id, "project_count": len(projects)}
                    })

                # Email
                subject = f"Urgent: Judging Deadline for {event_name}"
                body = f"""
                <html>
                    <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #6C3BFF;">Judging Protocol Reminder</h2>
                            <p>Hello Evaluator,</p>
                            <p>This is an automated reminder that the judging deadline for <strong>{event_name}</strong> is approaching.</p>
                            <p>Our records show you have <strong>{len(projects)}</strong> pending assessments:</p>
                            <ul>
                                {"".join([f"<li>{p}</li>" for p in projects[:5]])}
                                {f"<li>...and {len(projects)-5} more</li>" if len(projects) > 5 else ""}
                            </ul>
                            <p>Please log in to your <strong>Judge Portal</strong> to complete your evaluations.</p>
                            <div style="margin-top: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px;">
                                <strong>Deadline:</strong> {event["submission_deadline"]}
                            </div>
                            <p style="font-size: 12px; color: #999; margin-top: 40px;">
                                This is a synchronized system notification from Studlyf Engineering.
                            </p>
                        </div>
                    </body>
                </html>
                """
                asyncio.create_task(send_notification_email(email, subject, body))

reminder_service = ReminderService()
