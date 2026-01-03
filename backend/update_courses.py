import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "studlyf_db"

async def add_marketplace_data():
    """Add price, rating, and other marketplace data to existing courses"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    courses_col = db["courses"]

    # Sample course enhancements
    course_enhancements = {
        "price": 49.99,
        "rating": 4.8,
        "total_reviews": 342,
        "total_hours": 24.5,
        "level": "Intermediate",
        "key_topics": [
            "System Design",
            "Scalability Architecture",
            "Database Optimization",
            "Load Balancing",
            "Caching Strategies",
            "Security Best Practices"
        ],
        "last_updated": "December 2025",
        "instructor": "Engineering Standards Team",
        "is_bestseller": False,
        "is_premium": False
    }

    # Update all courses with marketplace data
    result = await courses_col.update_many(
        {},
        {"$set": course_enhancements}
    )

    print(f"Updated {result.modified_count} courses with marketplace data")

    # Make some courses bestsellers/premium based on criteria
    await courses_col.update_many(
        {"role_tag": "Backend"},
        {"$set": {"is_bestseller": True, "price": 59.99}}
    )

    await courses_col.update_many(
        {"role_tag": "AI"},
        {"$set": {"is_premium": True, "price": 79.99, "rating": 4.9}}
    )

    print("Marketplace data successfully added!")

async def add_new_courses():
    """Add 2 new courses to the database"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    courses_col = db["courses"]

    new_courses = [
        {
            "_id": "cloud-devops-master",
            "title": "Cloud DevOps & Infrastructure as Code",
            "description": "Master modern DevOps practices, containerization with Docker, orchestration with Kubernetes, and Infrastructure as Code with Terraform. Build scalable cloud infrastructure.",
            "role_tag": "Backend",
            "difficulty": "Advanced",
            "skills": ["Docker", "Kubernetes", "Terraform", "CI/CD", "AWS", "DevOps"],
            "duration": "40 hours",
            "image": "https://via.placeholder.com/300x200?text=Cloud+DevOps",
            "price": 69.99,
            "rating": 4.9,
            "total_reviews": 512,
            "total_hours": 40,
            "level": "Advanced",
            "key_topics": [
                "Docker Containerization",
                "Kubernetes Orchestration",
                "CI/CD Pipelines",
                "Infrastructure as Code",
                "Cloud Security",
                "Monitoring & Logging",
                "AWS & Azure",
                "Microservices Architecture"
            ],
            "last_updated": "January 2026",
            "instructor": "DevOps Experts Team",
            "is_bestseller": True,
            "is_premium": False,
            "standard": "Professional"
        },
        {
            "_id": "web-security-advanced",
            "title": "Advanced Web Security & Penetration Testing",
            "description": "Learn advanced web security concepts, OWASP top 10, vulnerability assessment, and ethical hacking techniques. Protect your applications from modern threats.",
            "role_tag": "Cybersecurity",
            "difficulty": "Advanced",
            "skills": ["Web Security", "Penetration Testing", "OWASP", "Burp Suite", "Network Security", "Ethical Hacking"],
            "duration": "35 hours",
            "image": "https://via.placeholder.com/300x200?text=Web+Security",
            "price": 74.99,
            "rating": 4.7,
            "total_reviews": 289,
            "total_hours": 35,
            "level": "Advanced",
            "key_topics": [
                "OWASP Top 10 Vulnerabilities",
                "SQL Injection & XSS Prevention",
                "Authentication & Authorization",
                "Penetration Testing Tools",
                "Vulnerability Assessment",
                "Secure Coding Practices",
                "Network Security",
                "API Security"
            ],
            "last_updated": "January 2026",
            "instructor": "Security Experts Team",
            "is_bestseller": False,
            "is_premium": True,
            "standard": "Professional"
        }
    ]

    # Insert new courses
    result = await courses_col.insert_many(new_courses)
    print(f"Added {len(result.inserted_ids)} new courses!")
    for course_id in result.inserted_ids:
        print(f"  - {course_id}")

    client.close()

if __name__ == "__main__":
    asyncio.run(add_marketplace_data())
    asyncio.run(add_new_courses())
