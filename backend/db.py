from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
from dotenv import load_dotenv

# Load explicitly from the parent directory .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://saieshwarerelli10:Nirvaha%25studly@nirvaha-studlfy.s1l8mvx.mongodb.net/?appName=Nirvaha-studlfy")
DB_NAME = os.getenv("DB_NAME", "studlyf_db")

client = AsyncIOMotorClient(MONGO_URL, tlsCAFile=certifi.where())
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

# System Deconstruction Lab Collections
sdl_projects_col = db["sdl_projects"]
sdl_members_col = db["sdl_project_members"]
sdl_tasks_col = db["sdl_tasks"]
sdl_comments_col = db["sdl_comments"]
sdl_join_requests_col = db["sdl_join_requests"]

# Ads / Advertisements
ads_col = db["advertisements"]

# Users and Badges
users_col = db["users"]

# Resume Builder
resumes_col = db["resumes"]

# Skill Assessment
skill_assessments_col = db["skill_assessments"]

# Mentors & Companies
mentors_col = db["mentors"]
companies_col = db["companies"]

# Payments & Revenue logs
payments_col = db["payments"]

# System Auditing
audit_logs_col = db["audit_logs"]
