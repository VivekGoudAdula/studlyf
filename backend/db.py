from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
courses_col = db["courses"]
modules_col = db["modules"]
theories_col = db["theories"]
videos_col = db["videos"]
quizzes_col = db["quizzes"]
projects_col = db["projects"]
progress_col = db["progress"]
certificates_col = db["certificates"]

# Marketplace Collections
cart_col = db["cart"]
enrollments_col = db["enrollments"]

# Interview Collections
interviews_col = db["interviews"]
