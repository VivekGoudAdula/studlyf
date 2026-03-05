import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "studlyf_db"

async def add_missing_courses():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    courses_col = db["courses"]

    new_courses = [
        {
            "_id": "uiux-01",
            "title": "Product Design & HCI",
            "role_tag": "Design",
            "school": "Creative Arts",
            "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
            "level": "Intermediate", 
            "price": 49.99
        },
        {
            "_id": "fintech-01",
            "title": "Fintech Systems Engineer",
            "role_tag": "Finance",
            "school": "Economics & Systems",
            "image": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&auto=format&fit=crop",
            "level": "Advanced",
            "price": 59.99
        }
    ]

    for course in new_courses:
        await courses_col.update_one(
            {"_id": course["_id"]},
            {"$set": course},
            upsert=True
        )
    print("Successfully added new courses with images!")
    client.close()

if __name__ == "__main__":
    asyncio.run(add_missing_courses())
