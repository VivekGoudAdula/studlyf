from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime

class Course(BaseModel):
    id: str = Field(..., alias="_id")
    title: str
    description: str
    role_tag: str  # Backend / Frontend / AI
    difficulty: str  # Beginner / Inter / Advanced
    image: Optional[str] = None
    skills: Optional[List[str]] = None
    duration: Optional[str] = None
    standard: Optional[str] = None
    school: Optional[str] = None
    # Marketplace fields
    price: float = 0.0
    rating: float = 4.5
    total_reviews: int = 0
    total_hours: float = 0.0
    category: Optional[str] = None
    level: Optional[str] = None  # Beginner / Intermediate / Advanced
    key_topics: Optional[List[str]] = None
    last_updated: Optional[str] = None
    instructor: Optional[str] = None
    instructor_name: Optional[str] = None
    instructor_image: Optional[str] = None
    instructor_description: Optional[str] = None
    is_bestseller: bool = False
    is_premium: bool = False

class Module(BaseModel):
    id: str = Field(..., alias="_id")
    course_id: str
    title: str
    order_index: int
    estimated_time: str

class Theory(BaseModel):
    id: str = Field(..., alias="_id")
    module_id: str
    markdown_content: str
    reading_time: int
    key_takeaways: List[str]

class Video(BaseModel):
    id: str = Field(..., alias="_id")
    module_id: str
    video_url: str
    duration: str
    is_dummy: bool = True

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answers: List[int] # Indices of correct options
    explanation: str

class Quiz(BaseModel):
    id: str = Field(..., alias="_id")
    module_id: str
    questions: List[QuizQuestion]
    pass_mark: int = 70

class Project(BaseModel):
    id: str = Field(..., alias="_id")
    module_id: str
    problem_statement: str
    requirements: List[str]
    rubric: dict

class UserProgress(BaseModel):
    user_id: str
    course_id: str
    module_id: str
    theory_completed: bool = False
    video_completed: bool = False
    quiz_score: float = 0.0
    quiz_answers: List[List[int]] = [] # Index i contains list of chosen option indices for question i
    project_status: str = "not_started" # not_started, submitted, approved
    project_submission_link: Optional[str] = None  # GitHub/drive link for project
    status: str = "locked" # locked, unlocked, completed

# Marketplace Models

class CartItem(BaseModel):
    user_id: str
    course_id: str
    course_title: str
    course_price: float
    added_at: datetime = Field(default_factory=datetime.utcnow)

class Notification(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_id: Optional[str] = None
    message: str
    type: str  # registration / approval / result
    trigger_type: str = "system" # system / manual
    sent_at: Optional[datetime] = None
    is_read: bool = False
    delivery_status: str = "pending" # pending / sent / failed
    retry_count: int = 0
    last_attempt_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EventJudge(BaseModel):
    event_id: str
    judge_id: str
    assigned_at: datetime = Field(default_factory=datetime.utcnow)

class Enrollment(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    course_id: str
    course_title: str
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    progress: float = 0.0  # 0-100
    last_accessed: Optional[datetime] = None
    last_accessed_module: Optional[str] = None

# Mock Interview Models

class InterviewerPersona(BaseModel):
    name: str
    role: str
    company_style: str
    tone: str # formal, neutral, friendly, intense
    depth: str # structured, conversational, deep-dive
    follow_up_style: str # aggressive, probing, gentle

class InterviewRound(BaseModel):
    round_type: str # technical, behavioral, hr_voice
    persona: InterviewerPersona
    status: str = "pending" # pending, active, completed
    score: Optional[float] = None
    feedback: Optional[str] = None
    assessment_metrics: Optional[dict] = None

class InterviewSession(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    company: str
    role: str
    experience_level: str # Fresher, Mid, Senior
    rounds: List[InterviewRound] = []
    current_round_index: int = 0
    status: str = "setup" # setup, in_progress, completed
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ========== System Deconstruction Lab Models ==========

class SDLProject(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    owner_id: str
    owner_name: str
    owner_avatar: Optional[str] = None
    title: str
    project_type: str  # system_replica, original_build, collaboration_request
    problem_statement: str
    architecture_focus: str
    skills_required: List[str] = []
    team_size: int = 1
    timeline: str  # e.g., "4 weeks"
    roles_needed: List[str] = []  # frontend, backend, devops, ai, ui_ux
    tags: List[str] = []  # AI, Backend, System Design, Full Stack, DevOps, Beginner Friendly
    github_link: Optional[str] = None
    overview: Optional[str] = None
    architecture_breakdown: Optional[str] = None
    feature_checklist: List[dict] = []  # [{name, completed}]
    progress: float = 0.0  # 0-100
    status: str = "open"  # open, in_progress, completed, archived
    featured: bool = False
    trending: bool = False
    views: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SDLProjectMember(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    project_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    role: str  # frontend, backend, devops, ai, ui_ux, lead
    status: str = "active"  # active, removed
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class SDLTask(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    project_id: str
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None  # user_id
    assigned_name: Optional[str] = None
    status: str = "todo"  # todo, in_progress, review, done
    priority: str = "medium"  # low, medium, high, critical
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SDLComment(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    project_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SDLJoinRequest(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    project_id: str
    user_id: str
    user_name: str
    user_avatar: Optional[str] = None
    role_requested: str
    message: Optional[str] = None
    status: str = "pending"  # pending, accepted, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ========== Institution Dashboard Models ==========

class Institution(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    cached_stats: dict = {}  # To store pre-calculated dashboard metrics
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Event(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    institution_id: str
    title: str
    description: str
    category: str  # Hackathon, Coding Competition, Design Challenge
    event_type: str  # Online, Offline, Hybrid
    status: str = "DRAFT"  # DRAFT, LIVE, ENDED, ARCHIVED
    start_date: datetime
    end_date: datetime
    registration_deadline: datetime
    submission_deadline: Optional[datetime] = None
    participation_mode: str = "BOTH"  # INDIVIDUAL, TEAM, BOTH
    max_participants: Optional[int] = None
    min_team_size: int = 1
    max_team_size: int = 5
    prize_pool: Optional[str] = None
    number_of_prizes: Optional[int] = None
    rules_guidelines: Optional[str] = None
    # Feature Flags
    has_submission: bool = True
    requires_github: bool = False
    requires_demo_video: bool = False
    requires_file_upload: bool = False
    has_judging: bool = True
    is_blind_judging: bool = False
    judging_criteria: List[dict] = Field(default_factory=lambda: [
        {"name": "Innovation", "max_score": 10},
        {"name": "Technical Execution", "max_score": 10},
        {"name": "Impact", "max_score": 10}
    ])
    created_by: str  # user_id of admin
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Participant(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_id: str
    institution_id: str
    college_name: Optional[str] = None
    year: Optional[str] = None
    department: Optional[str] = None
    skills: List[str] = []
    registration_status: str = "Registered"  # Registered, Verified, Rejected
    team_id: Optional[str] = None
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Team(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_name: str
    team_leader_id: str
    members: List[dict] = []  # [{user_id, role}]
    status: str = "Pending"  # Pending, Approved, Rejected, Disqualified
    formed_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Submission(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_id: Optional[str] = None
    participant_id: Optional[str] = None
    project_title: str
    project_description: str
    github_url: Optional[str] = None
    demo_video_url: Optional[str] = None
    attachments: List[str] = []  # URLs
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "Submitted"  # Submitted, Under Review, Approved, Rejected
    average_score: float = 0.0
    plagiarism_score: float = 0.0
    plagiarism_report: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Judge(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    expertise_areas: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Score(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    submission_id: str
    judge_id: str
    event_id: str
    criteria_scores: dict  # {criterion_name: score}
    total_score: float
    comments: Optional[str] = None
    evaluated_at: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LeaderboardEntry(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    team_id: Optional[str] = None
    participant_id: Optional[str] = None
    total_score: float
    rank: int
    points: int = 0
    final_status: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Notification(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    event_id: Optional[str] = None
    message: str
    type: str  # registration, approval, result, update
    trigger_type: str = "system"  # system, manual
    is_read: bool = False
    delivery_status: str = "pending"  # pending, sent, failed
    retry_count: int = 0
    last_attempt_at: Optional[datetime] = None
    sent_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EventJudge(BaseModel):
    event_id: str
    judge_id: str
    assigned_at: datetime = Field(default_factory=datetime.utcnow)

class Certificate(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    event_id: str
    user_id: str
    team_id: Optional[str] = None
    participant_name: str
    team_name: Optional[str] = None
    rank: Optional[int] = None
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    verification_code: str
    verification_url: str
    qr_code: Optional[str] = None
    immutable_flag: bool = True
