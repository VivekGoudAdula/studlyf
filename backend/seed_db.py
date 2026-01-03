import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import uuid

MONGO_URL = "mongodb://localhost:27017/"
DB_NAME = "studlyf_db"

async def seed():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    # Clear existing
    await db.courses.drop()
    await db.modules.drop()
    await db.theories.drop()
    await db.videos.drop()
    await db.quizzes.drop()
    await db.projects.drop()
    await db.progress.drop()
    
    course_id = str(uuid.uuid4())
    await db.courses.insert_one({
        "_id": course_id,
        "title": "Backend Engineering Elite",
        "description": "Master distributed systems, APIs, and high-performance databases.",
        "role_tag": "Backend",
        "difficulty": "Intermediate",
        "image": "https://miro.medium.com/max/938/0*lbtSAeYRtmUMAWeY.png",
        "skills": ["System Design", "APIs", "Databases"],
        "duration": "12 Weeks",
        "standard": "PROTOCOL_X"
    })
    
    # MODULE 1
    m1_id = str(uuid.uuid4())
    await db.modules.insert_one({
        "_id": m1_id,
        "course_id": course_id,
        "title": "Architectural Protocols",
        "order_index": 1,
        "estimated_time": "2 hours"
    })
    
    theory1_md = """# Architectural Protocols: The Foundation of Scale

## Introduction to API Design Patterns

In modern distributed systems, the way services communicate is crucial for performance, reliability, and scalability.

## REST Architecture

**REST (Representational State Transfer)** is not a protocol—it's an architectural style that uses HTTP as its foundation.

### Core Principles:
- **Statelessness**: Each request contains all information needed
- **Resource-Based**: Everything is a resource with a unique URI
- **HTTP Methods**: GET, POST, PUT, DELETE map to CRUD operations
- **Idempotency**: GET, PUT, DELETE should be repeatable without side effects

### Example REST Endpoint Structure:
- GET /api/users - List all users
- POST /api/users - Create new user
- GET /api/users/123 - Get specific user
- PUT /api/users/123 - Update user
- DELETE /api/users/123 - Delete user

## gRPC and Binary Protocols

**gRPC** uses binary serialization (Protocol Buffers) for extreme performance:
- **Speed**: 7-10x faster than REST
- **Type Safety**: Schema defined in .proto files
- **Streaming**: Bidirectional streaming support

## API Security Fundamentals

### Authentication vs Authorization
- **Authentication**: Who are you? (JWT, OAuth2, API Keys)
- **Authorization**: What can you do? (RBAC, ACLs)

## Scaling Considerations

### Horizontal vs Vertical Scaling
- **Vertical**: Add more CPU/RAM to existing servers (limited)
- **Horizontal**: Add more servers (virtually unlimited)

Stateless APIs enable horizontal scaling. Each request can go to any server.

## Key Takeaways

✅ REST is stateless—critical for scaling  
✅ Idempotency prevents duplicate operations during retries  
✅ gRPC trades readability for performance  
✅ Authentication answers "who", Authorization answers "what"  
✅ Horizontal scaling requires stateless design

**Next Steps**: Watch the video walkthrough and complete the quiz.
"""
    
    await db.theories.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m1_id,
        "markdown_content": theory1_md,
        "reading_time": 15,
        "key_takeaways": [
            "REST is an architectural style, not a protocol.",
            "Statelessness is key to horizontal scaling.",
            "gRPC uses binary serialization for extreme performance.",
            "Idempotency prevents side-effects during retries."
        ]
    })
    
    await db.videos.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m1_id,
        "video_url": "https://www.youtube.com/embed/iyenGWDG9t0",
        "duration": "18:30",
        "is_dummy": True
    })
    
    await db.projects.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m1_id,
        "problem_statement": "Design a basic REST API for a task management system with at least 3 endpoints.",
        "requirements": [
            "Use FastAPI or Express.js",
            "Include GET and POST methods",
            "Add a README with setup instructions",
            "Deploy on Vercel, Netlify, or Render",
            "Submit deployed link (REQUIRED)",
            "GitHub repository link (optional)"
        ],
        "rubric": {"functionality": 50, "code_quality": 30, "documentation": 20}
    })

    # MODULE 2
    m2_id = str(uuid.uuid4())
    await db.modules.insert_one({
        "_id": m2_id,
        "course_id": course_id,
        "title": "High-Performance Data Persistence",
        "order_index": 2,
        "estimated_time": "3 hours"
    })
    
    theory2_md = """# High-Performance Data Persistence: Beyond Basic SQL

## Database Fundamentals

Data persistence is the backbone of every application. Choosing the right database and optimizing queries can make or break your system's performance.

## SQL vs NoSQL

### Relational Databases (SQL)
**Examples**: PostgreSQL, MySQL, Oracle

**Strengths**:
- ACID guarantees (Atomicity, Consistency, Isolation, Durability)
- Complex queries with JOINs
- Data integrity through constraints

**Use Cases**: Financial systems, E-commerce platforms

### NoSQL Databases
**Examples**: MongoDB, Cassandra, Redis

**Types**:
1. **Document Stores** (MongoDB): JSON-like documents
2. **Key-Value** (Redis): Lightning-fast caching
3. **Wide Column** (Cassandra): Massive scale
4. **Graph** (Neo4j): Relationship-heavy data

## Indexing: The Performance Multiplier

Indexes help find data without scanning everything.

### Example: Without Index
- Query: SELECT * FROM users WHERE email = 'john@example.com'
- Time: 2000ms (scans 1M rows)

### With Index
- Create index: CREATE INDEX idx_email ON users(email)
- Same query now takes: 5ms

### Index Trade-offs
✅ **Pros**: Faster reads (100-1000x improvement)  
❌ **Cons**: Slower writes, more storage

## Database Normalization

Breaking data into smaller tables to reduce redundancy.

**Denormalized (Bad)**: Single Orders table with customer_name, customer_email duplicated

**Normalized (Good)**: Separate Customers and Orders tables linked by customer_id

✅ No duplication, data consistency  
❌ Requires JOINs (slower reads)

## Query Optimization

### N+1 Query Problem
- BAD: Runs 1 + N queries (loop over users, query orders for each)
- GOOD: Runs 1 query with JOIN to get all data at once

Using JOINs and proper query planning prevents the N+1 problem.

## Sharding: Horizontal Database Scaling

Split data across multiple servers when one isn't enough.

### Strategies:
1. **Range-Based**: Users 1-1M on Server A, 1M-2M on Server B
2. **Hash-Based**: Hash user_id → determines server
3. **Geographic**: US users on US server, EU on EU server

## CAP Theorem

**You can only pick 2 of 3:**
- **C**onsistency: All nodes see same data
- **A**vailability: System always responds
- **P**artition Tolerance: Works despite network failures

## Key Takeaways

✅ Indexes speed up reads but slow down writes  
✅ Normalize to reduce redundancy, denormalize for performance  
✅ Sharding enables horizontal scaling at cost of complexity  
✅ CAP theorem: choose consistency or availability during failures  
✅ Always use connection pooling in production

**Next**: Watch the deep-dive video and test your knowledge with the AI-generated quiz.
"""
    
    await db.theories.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m2_id,
        "markdown_content": theory2_md,
        "reading_time": 20,
        "key_takeaways": [
            "Indexes significantly reduce query time but slow down writes.",
            "Normalizing data reduces storage but can complicate reads.",
            "Sharding is the ultimate solution for horizontal database scaling.",
            "Understand the CAP theorem before choosing a database."
        ]
    })
    
    await db.videos.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m2_id,
        "video_url": "https://www.youtube.com/embed/W2Z7fbCLSTw",
        "duration": "25:45",
        "is_dummy": True
    })
    
    await db.projects.insert_one({
        "_id": str(uuid.uuid4()),
        "module_id": m2_id,
        "problem_statement": "Implement a database schema for an e-commerce site with optimized indexing for product searches.",
        "requirements": [
            "Provide a SQL or NoSQL schema",
            "Explain your indexing choices",
            "Demonstrate a complex join or aggregation query",
            "Create a simple demo UI to showcase the schema",
            "Deploy on Vercel, Netlify, or Render",
            "Submit deployed link (REQUIRED)",
            "GitHub repository link (optional)"
        ],
        "rubric": {"schema_design": 40, "indexing_logic": 40, "query_efficiency": 20}
    })

    print("✅ Seed complete! Database updated with:")
    print("  - 1 Course (Backend Engineering Elite)")
    print("  - 2 Modules with full theory content")
    print("  - 2 YouTube video links")
    print("  - 2 Projects (link submission required)")
    print("  - Quizzes will be AI-generated on demand")

if __name__ == "__main__":
    asyncio.run(seed())
