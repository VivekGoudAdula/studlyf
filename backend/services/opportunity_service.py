from db import db
from models import Opportunity, OpportunityApplication
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

opportunities_col = db["opportunities"]
opportunity_applications_col = db["opportunity_applications"]

async def create_opportunity(data: dict) -> dict:
    """Creates a new opportunity in the database."""
    # Ensure applicantsCount is 0 for new opportunities
    data["applicantsCount"] = 0
    data["createdAt"] = datetime.utcnow()
    data["status"] = "active"
    
    # Handle deadline if it's a string
    if isinstance(data.get("deadline"), str):
        data["deadline"] = datetime.fromisoformat(data["deadline"].replace("Z", "+00:00"))
        
    result = await opportunities_col.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data

async def get_all_opportunities(filters: dict = None) -> List[dict]:
    """Retrieves all opportunities from the database with optional filtering and automated sync."""
    from db import events_col
    
    # 1. Automated Sync Check (If collection is empty, populate from events)
    opp_count = await opportunities_col.count_documents({})
    if opp_count == 0:
        cursor = events_col.find({"opportunityType": {"$exists": True}})
        async for event in cursor:
            # Simple mapping logic
            opp_type = event.get("opportunityType", "Competition")
            if "Hackathon" in opp_type: opp_type = "Hackathon"
            elif "Job" in opp_type: opp_type = "Job"
            elif "Internship" in opp_type: opp_type = "Internship"
            else: opp_type = "Competition"

            opp_data = {
                "title": event.get("title", "New Opportunity"),
                "organization": event.get("organisation", event.get("institution_name", "Partner Institution")),
                "type": opp_type,
                "description": event.get("description", ""),
                "location": f"{event.get('city', 'Remote')}, {event.get('opportunityMode', 'Online')}",
                "deadline": event.get("registrationDeadline", datetime.utcnow()),
                "applicantsCount": 0,
                "createdAt": event.get("created_at", datetime.utcnow()),
                "createdBy": event.get("institution_id", "default_inst"),
                "status": "active",
                "event_link_id": str(event["_id"])
            }
            await opportunities_col.insert_one(opp_data)

    # 2. Regular Fetching
    query = {"status": "active"}
    if filters:
        if filters.get("type"):
            query["type"] = filters["type"]
        if filters.get("institution_id"):
            query["createdBy"] = filters["institution_id"]
            
    cursor = opportunities_col.find(query).sort("createdAt", -1)
    opportunities = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        opportunities.append(doc)
    return opportunities

async def get_opportunity_by_id(opportunity_id: str) -> Optional[dict]:
    """Retrieves a single opportunity by its ID."""
    doc = await opportunities_col.find_one({"_id": ObjectId(opportunity_id)})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc

async def apply_for_opportunity(application_data: dict) -> dict:
    """Saves a new application for an opportunity."""
    application_data["applied_at"] = datetime.utcnow()
    application_data["status"] = "pending"
    
    result = await opportunity_applications_col.insert_one(application_data)
    
    # Increment applicantsCount in the opportunity
    await opportunities_col.update_one(
        {"_id": ObjectId(application_data["opportunity_id"])},
        {"$inc": {"applicantsCount": 1}}
    )
    
    application_data["_id"] = str(result.inserted_id)
    return application_data

async def get_user_applications(user_id: str) -> List[dict]:
    """Retrieves all applications submitted by a specific user."""
    cursor = opportunity_applications_col.find({"user_id": user_id})
    applications = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        applications.append(doc)
    return applications
