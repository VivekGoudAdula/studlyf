from motor.motor_asyncio import AsyncIOMotorClient
import os
import certifi
import logging
from dotenv import load_dotenv

# Setup production logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("db_service")

# Load explicitly from the parent directory .env
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class DatabaseManager:
    """
    Production-Grade Database Manager.
    Renamed instance to 'db' for compatibility.
    """
    def __init__(self):
        self.url = os.getenv("MONGO_URL")
        self.db_name = os.getenv("DB_NAME", "studlyf_db")
        
        if not self.url:
            raise ValueError("CRITICAL: MONGO_URL is not set in environment variables.")

        # Initialize client and db immediately for module-level collection access
        self.client = AsyncIOMotorClient(
            self.url,
            serverSelectionTimeoutMS=5000,
            tlsCAFile=certifi.where() if self.url.lower().startswith("mongodb+srv://") else None
        )
        self.db = self.client[self.db_name]

    async def connect(self):
        """Verify connectivity and run health checks."""
        try:
            # Verify connectivity
            await self.client.admin.command('ping')
            logger.info(f"Connected to MongoDB: {self.db_name}")
            
            # Initialize core indexes
            await self.ensure_indexes()
            
        except Exception as e:
            logger.error(f"Database Connection Failed: {e}")
            # Do not raise, allow app to start for diagnostics

    async def disconnect(self):
        """Graceful shutdown."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")

    async def ensure_indexes(self):
        """Enforces performance and data integrity."""
        try:
            await self.db.users.create_index("user_id", unique=True)
            await self.db.users.create_index("email", unique=True)
            await self.db.institutions.create_index("name", unique=True)
            await self.db.institutions.create_index("institution_id", unique=True)
        except Exception as e:
            logger.warning(f"Index creation warning: {e}")
            pass

    def __getitem__(self, collection_name: str):
        """Allows db['collection'] access."""
        return self.db[collection_name]

# --- Global Instance renamed to 'db' as requested ---
db = DatabaseManager()

# ─── COLLECTION REGISTRY ──────────────────────────────────────────────────────
# Academic Core
courses_col = db["courses"]
modules_col = db["modules"]
theories_col = db["theories"]
videos_col = db["videos"]
quizzes_col = db["quizzes"]
projects_col = db["projects"]
progress_col = db["progress"]

# Marketplace & Identity
cart_col = db["cart"]
enrollments_col = db["enrollments"]
users_col = db["users"]
resumes_col = db["resumes"]
certificates_col = db["certificates"]

# Career & Operations
interviews_col = db["interviews"]
mentors_col = db["mentors"]
companies_col = db["companies"]
skill_assessments_col = db["skill_assessments"]
ads_col = db["advertisements"]
payments_col = db["payments"]
audit_logs_col = db["audit_logs"]

# System Deconstruction Lab (SDL)
sdl_projects_col = db["sdl_projects"]
sdl_members_col = db["sdl_project_members"]
sdl_tasks_col = db["sdl_tasks"]
sdl_comments_col = db["sdl_comments"]
sdl_join_requests_col = db["sdl_join_requests"]

# Institution Dashboard Ecosystem (High-End Modular Architecture)
institutions_col = db["institutions"]
events_col = db["events"]
rounds_col = db["rounds"]                # Dynamic Phases (Assessment, Submission, etc.)
form_fields_col = db["form_fields"]      # Form Builder Layer
participants_col = db["participants"]
teams_col = db["teams"]
submissions_col = db["submissions"]
submission_data_col = db["submission_data"] # Flexibility Layer (Key-Value for PPT, GitHub)
judges_col = db["judges"]
scores_col = db["scores"]
evaluation_criteria_col = db["evaluation_criteria"] # Evaluation System
notifications_col = db["notifications"]
leaderboard_col = db["leaderboard"]
results_col = db["results"]
event_judges_col = db["event_judges"]
workflow_states_col = db["workflow_states"] # State Machine (Applied, Shortlisted, etc.)
