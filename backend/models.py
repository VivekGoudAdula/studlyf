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
