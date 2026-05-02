import asyncio
from db import events_col, opportunities_col
from datetime import datetime

async def migrate():
    print("Checking events...")
    count = await events_col.count_documents({})
    print(f"Total events: {count}")
    
    opp_count = await opportunities_col.count_documents({})
    print(f"Total opportunities: {opp_count}")
    
    if opp_count == 0 and count > 0:
        print("Migrating events to opportunities...")
        cursor = events_col.find({})
        async for event in cursor:
            # Determine type
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
        print("Migration complete.")
    else:
        print("No migration needed or no events found.")

if __name__ == "__main__":
    asyncio.run(migrate())
