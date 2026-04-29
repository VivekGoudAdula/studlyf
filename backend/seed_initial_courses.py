import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

async def seed():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    courses_col = db["courses"]
    modules_col = db["modules"]

    # Initial data from Frontend Dummy List
    initial_courses = [
        {
            "_id": "se-01",
            "title": "Fullstack Systems Architect",
            "description": "Design and build end-to-end production systems with modern engineering protocols. Master the full stack.",
            "role_tag": "Engineering",
            "school": "Software Systems",
            "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 54.99,
            "skills": ["System Design", "React", "Node.js", "Distributed Systems"],
            "status": "published"
        },
        {
            "_id": "ai-01",
            "title": "Generative AI Specialist",
            "description": "Master the future of AI with Generative Models, LLMs, and Neural Architectures. Build next-gen intelligence.",
            "role_tag": "Intelligence",
            "school": "AI & Data",
            "image": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop",
            "difficulty": "Intermediate",
            "price": 49.99,
            "skills": ["LLMs", "Transformer Models", "PyTorch", "Prompt Engineering"],
            "status": "published"
        },
        {
            "_id": "pm-01",
            "title": "Product Strategy Elite",
            "description": "Learn the protocols of high-performing product leaders at top tech companies. Master growth, strategy, and execution.",
            "role_tag": "Management",
            "school": "Business & Design",
            "image": "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 59.99,
            "skills": ["Product Thinking", "Growth Loops", "Agile Protocols", "User Research"],
            "status": "published"
        },
        {
            "_id": "ds-01",
            "title": "Data Science & MLOps",
            "description": "End-to-end data lifecycle management, from exploratory analysis to high-scale model deployment.",
            "role_tag": "Data Science",
            "school": "Data Engineering",
            "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 64.99,
            "skills": ["Pandas", "Scikit-Learn", "AWS SageMaker", "ML Pipelines"],
            "status": "published"
        },
        {
            "_id": "cs-01",
            "title": "Cyber Security Operations",
            "description": "Advanced protocols for threat detection, ethical hacking, and secure system architecture.",
            "role_tag": "Security",
            "school": "Cyber Defense",
            "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 54.99,
            "skills": ["Kali Linux", "Network Security", "Pen Testing", "Incident Response"],
            "status": "published"
        },
        {
            "_id": "cloud-01",
            "title": "Cloud Native Developer",
            "description": "Master Kubernetes, Docker, and Microservices at scale using industry-standard protocols.",
            "role_tag": "DevOps",
            "school": "Infrastructure",
            "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop",
            "difficulty": "Intermediate",
            "price": 49.99,
            "skills": ["Docker", "Kubernetes", "Terraform", "CI/CD"],
            "status": "published"
        },
        {
            "_id": "blockchain-01",
            "title": "Web3 & Blockchain Architect",
            "description": "Build decentralized applications and smart contracts using advanced cryptographic protocols.",
            "role_tag": "Web3",
            "school": "Distributed Systems",
            "image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 69.99,
            "skills": ["Solidity", "Ethereum", "IPFS", "Smart Contracts"],
            "status": "published"
        },
        {
            "_id": "game-01",
            "title": "Unity Engine & XR Reality",
            "description": "Create immersive experiences combining high-performance game engine logic with spatial design.",
            "role_tag": "Game Dev",
            "school": "Creative Media",
            "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
            "difficulty": "Intermediate",
            "price": 44.99,
            "skills": ["C#", "Unity", "Spatial UI", "Physics Engines"],
            "status": "published"
        },
        {
            "_id": "uiux-01",
            "title": "Product Design & HCI",
            "description": "Human-Computer Interaction principles applied to modern product ecosystems.",
            "role_tag": "Design",
            "school": "Creative Arts",
            "image": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop",
            "difficulty": "Intermediate",
            "price": 39.99,
            "skills": ["Figma", "User Labs", "Design Tokens", "Prototyping"],
            "status": "published"
        },
        {
            "_id": "fintech-01",
            "title": "Fintech Systems Engineer",
            "description": "Architecting high-availability financial systems with low latency and extreme reliability.",
            "role_tag": "Finance",
            "school": "Economics & Systems",
            "image": "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800&auto=format&fit=crop",
            "difficulty": "Advanced",
            "price": 74.99,
            "skills": ["Low Latency", "SQL Optimization", "Security Protocols", "Distributed Ledgers"],
            "status": "published"
        }
    ]

    for course in initial_courses:
        # Upsert courses
        await courses_col.update_one(
            {"_id": course["_id"]},
            {"$set": course},
            upsert=True
        )
        
        # Add a placeholder module if none exist
        existing_module = await modules_col.find_one({"course_id": course["_id"]})
        if not existing_module:
            await modules_col.insert_one({
                "_id": str(uuid.uuid4()),
                "course_id": course["_id"],
                "title": "Introduction to the Protocol",
                "order_index": 1,
                "lessons": [
                    {"title": "Welcome and Overview", "type": "theory", "duration": "10 min"},
                    {"title": "Core Methodology", "type": "video", "duration": "15 min"},
                    {"title": "Foundational Assessment", "type": "quiz", "duration": "20 min"}
                ],
                "estimated_time": "45 min"
            })

    print(f"✅ Successfully seeded {len(initial_courses)} courses into MongoDB.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
