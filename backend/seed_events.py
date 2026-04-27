import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load from root .env
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(root_env)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.studlyf

async def seed_events():
    events = [
        {
            "institution_id": "inst_123",
            "title": "Global AI Innovation Hackathon",
            "description": "Join the world's largest AI hackathon to solve real-world problems using LLMs and Generative AI.",
            "category": "Technology",
            "event_type": "Hackathon",
            "status": "Live",
            "registration_deadline": datetime.utcnow() + timedelta(days=10),
            "start_date": datetime.utcnow() + timedelta(days=12),
            "end_date": datetime.utcnow() + timedelta(days=14),
            "prize_pool": "$50,000",
            "number_of_prizes": 3,
            "rules_guidelines": "1. Team size: 1-4. 2. Must use at least one AI tool. 3. Submissions must be original.",
            "max_participants": 500,
            "min_team_size": 1,
            "max_team_size": 4,
            "judges": ["Dr. Aris", "Sarah Chen", "Mike Ross"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "institution_id": "inst_123",
            "title": "FinTech Case Competition",
            "description": "Analyze the future of digital banking and present your solutions to industry experts.",
            "category": "Business",
            "event_type": "Coding Competition",
            "status": "Draft",
            "registration_deadline": datetime.utcnow() + timedelta(days=20),
            "start_date": datetime.utcnow() + timedelta(days=25),
            "end_date": datetime.utcnow() + timedelta(days=26),
            "prize_pool": "$10,000",
            "number_of_prizes": 2,
            "rules_guidelines": "Case will be released on start date.",
            "max_participants": 200,
            "min_team_size": 2,
            "max_team_size": 3,
            "judges": ["Finance Lead", "Banking Expert"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "institution_id": "inst_123",
            "title": "Design Sprint 2024",
            "description": "48 hours of pure design creativity. Re-imagine the mobile shopping experience.",
            "category": "Design",
            "event_type": "Design Challenge",
            "status": "Ended",
            "registration_deadline": datetime.utcnow() - timedelta(days=5),
            "start_date": datetime.utcnow() - timedelta(days=2),
            "end_date": datetime.utcnow() - timedelta(days=1),
            "prize_pool": "$5,000",
            "number_of_prizes": 1,
            "rules_guidelines": "Figma files required.",
            "max_participants": 100,
            "min_team_size": 1,
            "max_team_size": 1,
            "judges": ["Lead Designer"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.events.delete_many({"institution_id": "inst_123"})
    await db.events.insert_many(events)
    print("Events seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_events())
